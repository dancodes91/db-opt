"""Zoom Kiosk - Entry point (launches src.main)."""
import asyncio
import sys
import traceback

if __name__ == '__main__':
    from src.main import main
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('\n[Shutdown] Exiting... (KeyboardInterrupt from user)')
        sys.exit(0)
    except SystemExit as e:
        print(f'\n[Diagnostic] SystemExit received: code={e.code}')
        print('[Diagnostic] SystemExit can be triggered by sys.exit() or external process termination')
        raise
    except BaseException as e:
        print(f'\n[Diagnostic] Unexpected exit: {type(e).__name__}: {e}')
        traceback.print_exc()
        raise
