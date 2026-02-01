"""Allow running as: python -m src"""
import asyncio
import sys
from .main import main

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('\n[Shutdown] Exiting...')
        sys.exit(0)
