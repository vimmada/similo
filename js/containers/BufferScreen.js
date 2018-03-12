'use strict';

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Animated, Dimensions, Easing, ImageBackground, View } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default class BufferScreen extends Component {
  static navigationOptions = {
    title: 'Fetching Results...',
  };

  constructor(props) {
    super(props);

    this.state = { spinAnimation: new Animated.Value(0) };
  }

  componentDidMount() {
    this.spin();
  }

  spin() {
    this.state.spinAnimation.setValue(0);

    Animated.timing(
      this.state.spinAnimation,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
      }
    ).start(() => this.spin());
  }

  render() {
    const { photo } = this.props.navigation.state.params
    const { width, height } = Dimensions.get('window');

    const spin = this.state.spinAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground
            blurRadius={4}
            resizeMode="contain"
            style={{ width, height }}
            source={{ uri: photo.path }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',
                         width, height, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <AnimatedIcon
              name="spinner"
              color='#ffffff'
              size={72}
              style={{ transform: [{ rotate: spin }] }}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
