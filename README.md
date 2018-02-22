# similo
Similo is for fashion enthusiasts looking to draw inspiration from others’ outfits. Similo uses machine learning and information retrieval techniques to recommend clothing of similar style. Simply upload a photo and Similo will handle the rest.

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
To run the backend flask server just clone the repository shown in "Getting started" and switch to branch backend. Go inside the server file and do "pip install -e .". Once everything is installed properly run "./bin/image-processorrun" and go to localhost:8000. It should say: "Hello, World!". In order to view the api routes go to imageProcessor/views/index.py.  

## Misc
1. Until [this issue](https://github.com/facebook/react-native/pull/17672) is resolved, please run `rm $SIMILO/node_modules/react-native/local-cli/core/__fixtures__/files/package.json` in order to
properly load fonts and icons.
