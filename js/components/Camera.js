import { View } from 'react-native';
import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';

export default class Camera extends Component {
  render() {
    return (
      <View>
        <RNCamera
          ref={(camera) => { this.camera = camera; }}
        />
      </View>
    );
  }
}
