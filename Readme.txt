System requirements
- Node.js v20.17.0 (or v18+)
- Windows 10/11 (x64)
- Visual Studio Build Tools 2022(for native modules)
- Python 3.10.3 (for node-gyp)


Setup steps
- Install Node.js v20.17.0
- Install Visual Studio Build Tools 2022 (C++ workload)
- Run following commands on the project dir:
	npm install
	npm run rebuild:robotjs
	npm run rebuild:mouse
- Create config.json from examples.config.json and add your Zoom credentials
- Verify SDK:
   npm run check:sdk
- Build and run:
	npm run build
	npm start