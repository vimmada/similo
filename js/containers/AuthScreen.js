import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../config/styles';

import { login } from '../lib';

const { SIMILO_BLUE } = colors;

const styles = StyleSheet.create({
  input: {
    color: '#FFFFFF',
    width: '80%',
    borderWidth: 1,
    fontSize: 20,
    height: 50,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#FFFFFF',
  },
  touchableMenuItem: {
    width: '80%',
    marginBottom: 30,
  },
  menuText: {
    fontSize: 24,
    color: '#FFFFFF',
  }
});

export default class AuthScreen extends Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  constructor(props) {
    super(props);

    this.state = { username: '', password: '', statusMsg: '' };

    this.authAsync = this.authAsync.bind(this);
  }

  authAsync = async () => {
    login.bind(this)(this.state.username, this.state.password)
      .then(res => res.json())
      .then(async (data) => {
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
          this.props.navigation.navigate('App');
        } else {
          this.setState({ username: '', password: '', statusMsg: 'Invalid credentials.' });
        }
      })
      .catch(() => this.setState({ username: '', password: '', statusMsg: 'A network error occured.' }));
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4285f4', padding: 10 }}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          placeholder="username"
          style={styles.input}
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
          placeholderTextColor='#FFFFFF'
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholderTextColor='#FFFFFF'
        />
        <Text style={{ marginBottom: 20, color: 'red' }}>{ this.state.statusMsg }</Text>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="sign-in"
            size={30}
            onPress={this.authAsync.bind(this)}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Sign In</Text>
          </Icon.Button>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableMenuItem}>
          <Icon.Button
            name="user"
            size={30}
            onPress={() => this.props.navigation.navigate('CreateAccount')}
            backgroundColor={SIMILO_BLUE}
            borderColor='#FFFFFF'
            borderWidth={1}
            borderRadius={10}
          >
            <Text style={styles.menuText}>Create Account</Text>
          </Icon.Button>
        </TouchableOpacity>
      </View>
    );
  }
}
