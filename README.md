# similo
Similo is for fashion enthusiasts looking to draw inspiration from others’ outfits. Similo uses machine learning and information retrieval techniques to recommend clothing of similar style. Simply upload a photo and Similo will handle the rest.

## Notes
- `js/` contains frontend components; `server/` contains backend components
- To add a photo to an iOS/Android simulator's photo gallery, open the photo gallery and just drag the photo in.
- **Use Python 3!**

## Getting started
1. `git clone https://github.com/perryjiang/similo.git`
2. Install dependencies mentioned under "Building Projects with Native Code" [here](https://facebook.github.io/react-native/docs/getting-started.html).
3. `cd similo && yarn install` _or_ `cd similo && npm install`
4. `react-native link`

## Building Similo
1. `cd similo && react-native start`
2. In another terminal, navigate to the project directory and run `npm run <ios/android>`.
3. Optional: follow [this guide](https://facebook.github.io/react-native/docs/debugging.html) to enable React Native's live or hot reloading.

## Running the server for development:
In __another__ terminal:
```
cd $SIMILO/server
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
chmod +x ./bin/image-processorrun
./bin/image-processorrun
```

For running tests:
```
cd $SIMILO/server
source venv/bin/activate
python -m unittest
```

To test, navigate to localhost:8000/api/, which should say "Hello, World!"

To view the api routes, go to ./imageProcessor/views/index.py.

## Misc
1. If the project won't run due to `react-native-vector-icon` issues, try running Until `rm $SIMILO/node_modules/react-native/local-cli/core/__fixtures__/files/package.json`.
