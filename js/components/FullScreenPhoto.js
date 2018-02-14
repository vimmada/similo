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
        <BlurView
          viewRef={props.viewRef}
          style={{ position: 'absolute', width, height }}
        />
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
