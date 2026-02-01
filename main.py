"""Zoom Kiosk - Entry point (launches src.main)."""
import asyncio
import sys

if __name__ == '__main__':
    from src.main import main
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('\n[Shutdown] Exiting...')
        sys.exit(0)
