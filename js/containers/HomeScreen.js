import React, { Component } from 'react';
import { Button, Text, View } from 'react-native';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.onPictureTaken = this.onPictureTaken.bind(this);
  }

  onPictureTaken(picture) {
    throw Error('Not implemented!');

    this.props.navigation.navigate('Confirm', { picture });
  }

  render() {
    // TODO: incorporate <Camera />
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Similo!</Text>
        <Button
          title="Upload Photo"
          onPress={() => { this.props.navigation.navigate('UploadPhoto') }}
        />
      </View>
    );
  }
}
