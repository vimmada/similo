import React, { Component } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage, Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../config/styles';

import { selectPhotoFromGallery, logout, takePhotoWithCamera } from '../lib';

const { SIMILO_BLUE } = colors;

const styles = StyleSheet.create({
  touchableMenuItem: {
    width: '80%',
    marginBottom: 30,
  },
  menuText: {
    fontSize: 24,
    color: '#FFFFFF',
  }
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    global.HOME_KEY = props.navigation.state.key;
  }

  static navigationOptions = {
    title: 'Similo',
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4285f4' }}>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="camera"
            size={30}
            onPress={takePhotoWithCamera.bind(this)}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Take Photo</Text>
          </Icon.Button>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="image"
            size={30}
            onPress={selectPhotoFromGallery.bind(this)}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Upload Photo</Text>
          </Icon.Button>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="heart"
            size={30}
            onPress={() => this.props.navigation.navigate('SavedItems')}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Saved Items</Text>
          </Icon.Button>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="history"
            size={30}
            onPress={() => this.props.navigation.navigate('History')}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Previous Searches</Text>
          </Icon.Button>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="sign-out"
            size={30}
            onPress={this.signOutAsync}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Sign Out</Text>
          </Icon.Button>
        </TouchableOpacity>
      </View>
    );
  }
}
