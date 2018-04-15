import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../config/styles';

import { createAccount } from '../lib';

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

export default class CreateAccountScreen extends Component {
  static navigationOptions = {
    title: 'Create account',
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      firstname: 'firstname',
      lastname: 'lastname',
      statusMsg: '',
    };

    this.createAccount = this.createAccount.bind(this);
  }

  createAccount = async () => {
    if (!this.state.username || !this.state.email || !this.state.password ||
        !this.state.firstname || !this.state.lastname) {
      return this.setState({ statusMsg: 'Fields cannot be empty.' });
    }

    createAccount(this.state)
      .then(res => {
        if (res.status == 400) {
          this.setState({
            username: '',
            email: '',
            statusMsg: 'Username or email already exists.',
          });

          return;
        } else {
          return res.json();
        }
      })
      .then(async (data) => {
        if (data) {
          if (data.token) {
            await AsyncStorage.setItem('userToken', data.token);
            this.props.navigation.navigate('App');
          } else {
            this.setState({
              username: '',
              email: '',
              statusMsg: 'Username or email already exists.',
            });
          }
        }
      })
      .catch(() => {
        this.setState({
          username: '',
          email: '',
          statusMsg: 'A network error occured.',
        });
      });
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
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="email"
          style={styles.input}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
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
            name="user"
            size={30}
            onPress={this.createAccount}
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
