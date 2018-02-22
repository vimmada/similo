# similo
Similo is for fashion enthusiasts looking to draw inspiration from others’ outfits. Similo uses machine learning and information retrieval techniques to recommend clothing of similar style. Simply upload a photo and Similo will handle the rest.

## Notes
- `js/` contains frontend components; `server/` contains backend components
- Currently we are having issues using the [react-native-camera](https://github.com/react-native-community/react-native-camera) module, so we can only upload photos from the photo gallery.
- To add a photo to an iOS/Android simulator's photo gallery, open the photo gallery and just drag the photo in.
- Currently an image is hard-coded into the backend.

## Getting started
1. `git clone https://github.com/perryjiang/similo.git`
2. Install dependencies mentioned under "Building Projects with Native Code" [here](https://facebook.github.io/react-native/docs/getting-started.html).
3. `cd similo && yarn install` _or_ `cd similo && npm install`
4. `react-native link`

### iOS
1. Open the project in Xcode, and using the Project Navigator, expand the RNCamera project and delete the FaceDetector folder. **The project will not compile on iOS without this step!**

## Building Similo
1. `cd similo && react-native start`
2. In another terminal, navigate to the project directory and run `npm run <ios/android>`.
3. Optional: follow [this guide](https://facebook.github.io/react-native/docs/debugging.html) to enable React Native's live or hot reloading.

## Running The Backend Server
In __another__ terminal:
1. `cd $SIMILO/server`
2. `pip install -e .`
3. `chmod +x ./bin/image-processorrun`
4. `chmod +x ./bin/database`
5. `./bin/database reset`
6. `./bin/image-processorrun`
7. To test, navigate to localhost:8000, which should say "Hello, World!"

To view the api routes, go to ./imageProcessor/views/index.py.

## Misc
1. If the project won't run due to `react-native-vector-icon` issues, try running Until `rm $SIMILO/node_modules/react-native/local-cli/core/__fixtures__/files/package.json`.
