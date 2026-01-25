/**
 * Input handler for user preferences
 */

import { MouseAction } from './action-recorder';

/** Screen waypoints: [center, topCenter]. topCenter = 25px below top, 100px left of center. */
function getScreenWaypoints(): { center: { x: number; y: number }; topCenter: { x: number; y: number } } {
  try {
    const { screen } = require('electron');
    const bounds = screen.getPrimaryDisplay().bounds;
    const center = { x: Math.round(bounds.x + bounds.width / 2), y: Math.round(bounds.y + bounds.height / 2) };
    const topCenter = { x: Math.round(bounds.x + bounds.width / 2 - 100), y: Math.round(bounds.y + 25) };
    return { center, topCenter };
  } catch {
    return { center: { x: 960, y: 540 }, topCenter: { x: 860, y: 25 } };
  }
}

export class ActionPlayer {
  private robot: any = null;
  private isPlaying: boolean = false;
  private playbackSpeed: number = 1.0;
  private robotLoaded: boolean = false;

  /**
   * Initialize input handler
   */
  private ensureRobotLoaded(): void {
    if (this.robotLoaded && this.robot) {
      return;
    }

    try {
      this.robot = require('robotjs');
      this.robot.setMouseDelay(2);
      this.robotLoaded = true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? (error.stack || '') : '';
      
      // Obfuscate error messages - don't reveal module names
      if (errorMsg.includes('NODE_MODULE_VERSION') || 
          errorMsg.includes('Cannot find module') ||
          (errorStack && errorStack.includes('robotjs'))) {
        throw new Error(
          'Input handler module not available. Please rebuild native modules using: npm run rebuild:native'
        );
      }
      throw new Error('Input handler initialization failed');
    }
  }

  /**
   * WindMouse algorithm for natural mouse movement
   * G_0 - magnitude of the gravitational force
   * W_0 - magnitude of the wind force fluctuations
   * M_0 - maximum step size (velocity clip threshold)
   * D_0 - distance where wind behavior changes from random to damped
   */
  private async windMouse(
    startX: number,
    startY: number,
    destX: number,
    destY: number,
    G_0: number = 9,
    W_0: number = 5,
    M_0: number = 15,
    D_0: number = 12
  ): Promise<void> {
    const sqrt3 = Math.sqrt(3);
    const sqrt5 = Math.sqrt(5);
    
    let currentX = startX;
    let currentY = startY;
    let v_x = 0;
    let v_y = 0;
    let W_x = 0;
    let W_y = 0;
    let start_x = startX;
    let start_y = startY;
    let M_0_current = M_0;
    
    while (true) {
      const dist = Math.hypot(destX - start_x, destY - start_y);
      if (dist < 1) {
        break;
      }
      
      const W_mag = Math.min(W_0, dist);
      if (dist >= D_0) {
        W_x = W_x / sqrt3 + (2 * Math.random() - 1) * W_mag / sqrt5;
        W_y = W_y / sqrt3 + (2 * Math.random() - 1) * W_mag / sqrt5;
      } else {
        W_x /= sqrt3;
        W_y /= sqrt3;
        if (M_0_current < 3) {
          M_0_current = Math.random() * 3 + 3;
        } else {
          M_0_current /= sqrt5;
        }
      }
      
      v_x += W_x + G_0 * (destX - start_x) / dist;
      v_y += W_y + G_0 * (destY - start_y) / dist;
      const v_mag = Math.hypot(v_x, v_y);
      
      if (v_mag > M_0_current) {
        const v_clip = M_0_current / 2 + Math.random() * M_0_current / 2;
        v_x = (v_x / v_mag) * v_clip;
        v_y = (v_y / v_mag) * v_clip;
      }
      
      start_x += v_x;
      start_y += v_y;
      const move_x = Math.round(start_x);
      const move_y = Math.round(start_y);
      
      if (currentX !== move_x || currentY !== move_y) {
        this.robot.moveMouse(move_x, move_y);
        currentX = move_x;
        currentY = move_y;
        
        // Variable delay based on velocity - faster movement = shorter delay
        // Base delay of 1-2ms, inversely proportional to velocity magnitude
        const baseDelay = 1.5;
        const velocityFactor = Math.min(1.0, v_mag / M_0_current);
        // Faster = shorter delay (0.8-1.5ms range)
        const delay = baseDelay * (1.0 - velocityFactor * 0.3) + Math.random() * 0.2;
        await new Promise(resolve => setTimeout(resolve, Math.max(0.5, delay)));
      }
    }
    
    // Ensure final position is exact
    this.robot.moveMouse(destX, destY);
  }

  /**
   * Apply user preferences
   */
  async playActions(actions: MouseAction[]): Promise<void> {
    if (this.isPlaying) {
      return;
    }

    if (!actions || actions.length === 0) {
      return;
    }

    this.ensureRobotLoaded();

    this.isPlaying = true;

    try {
      // Filter to only process clicks (ignore move actions from old recordings)
      const clickActions = actions.filter(action => 
        action.type === 'click' || action.type === 'doubleclick'
      );

      if (clickActions.length === 0) {
        return;
      }

      // Sort actions by time to ensure correct order
      const sortedActions = [...clickActions].sort((a, b) => a.time - b.time);

      let previousTime = 0;

      for (const action of sortedActions) {
        if (!this.isPlaying) break;

        const delay = action.time - previousTime;
        if (delay > 0) {
          const waitMs = delay / this.playbackSpeed;
          const chunk = 50;
          let left = waitMs;
          while (left > 0 && this.isPlaying) {
            await new Promise(resolve => setTimeout(resolve, Math.min(chunk, left)));
            left -= chunk;
          }
        }
        if (!this.isPlaying) break;

        const { center, topCenter } = getScreenWaypoints();
        const currentPos = this.robot.getMousePos();
        let x = currentPos.x;
        let y = currentPos.y;

        // Waypoints before each click: current -> center -> topCenter (25px below top, 100px left of center) -> target
        if (x !== center.x || y !== center.y) {
          await this.windMouse(x, y, center.x, center.y);
          if (!this.isPlaying) break;
          x = center.x;
          y = center.y;
        }
        if (x !== topCenter.x || y !== topCenter.y) {
          await this.windMouse(x, y, topCenter.x, topCenter.y);
          if (!this.isPlaying) break;
          x = topCenter.x;
          y = topCenter.y;
        }
        if (x !== action.x || y !== action.y) {
          await this.windMouse(x, y, action.x, action.y);
        }
        if (!this.isPlaying) break;

        // Small random delay before click (5-15ms)
        await new Promise(resolve => setTimeout(resolve, Math.random() * 10 + 5));
        if (!this.isPlaying) break;

        // Execute the click
        if (action.type === 'click') {
          this.robot.mouseClick(action.button || 'left');
        } else if (action.type === 'doubleclick') {
          this.robot.mouseClick(action.button || 'left');
          // Random delay between clicks (30-60ms for natural double-click)
          await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 30));
          this.robot.mouseClick(action.button || 'left');
        }

        previousTime = action.time;
      }
    } catch (error) {
      throw error;
    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Stop execution (if in progress)
   */
  stop(): void {
    this.isPlaying = false;
  }

  /**
   * Check if currently executing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Set execution speed multiplier
   */
  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(5.0, speed));
  }
}
