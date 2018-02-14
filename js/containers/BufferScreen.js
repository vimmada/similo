import React, { Component } from 'react';
import { Dimensions, findNodeHandle, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { uploadPhoto } from '../lib';
import FullScreenPhoto from '../components/FullScreenPhoto';

function Spinner() {
  return <FontAwesome name="spinner" color='#ffffff' size={72} />;
}

export default class BufferScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { viewRef: null };

    this.getRecommendations = this.getRecommendations.bind(this);
    this.imageLoaded = this.imageLoaded.bind(this);
  }

  getRecommendations() {
    const { photo } = this.props.navigation.state.params;

    uploadPhoto(photo)
      .then(data => this.props.navigation.navigate('Recommendations', { data }));
  }

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const { photo } = this.props.navigation.state.params;

    return (
      <View>
        <FullScreenPhoto
          blur
          photo={photo}
          viewRef={this.state.viewRef}
          onLoadEnd={this.imageLoaded}
        />
        <View
          style={{
            width,
            height,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}
        >
          <Spinner />
        </View>
      </View>
    );
  }
}
