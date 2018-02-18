import React from 'react';
import { BlurView } from 'react-native-blur';
import { Dimensions, View, Image } from 'react-native';

export default function FillScreenImage(props) {
  const { width, height } = Dimensions.get('window');

  if (props.blur) {
    return (
      <View>
        <Image
          resizeMode="contain"
          source={{ uri: props.photo.uri }}
          style={{ width, height }}
          onLoadEnd={props.onLoadEnd}
        />
        {(this.state.viewRef == null ? null :
        <BlurView
          viewRef={props.viewRef}
          style={{ position: 'absolute', width, height }}
          blurType="light"
          blurAmount
        />)}
      </View>
    );
  }

  return (
    <View>
      <Image
        resizeMode="contain"
        source={{ uri: props.photo.uri }}
        style={{ width, height }}
        onLoadEnd={props.onLoadEnd}
      />
    </View>
  );
}
