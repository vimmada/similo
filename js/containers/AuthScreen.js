import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { login } from '../lib';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 20,
    height: 40,
    marginBottom: 20,
  },
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
      .then(async (res) => {
        if (res.token) {
          await AsyncStorage.setItem('userToken', res.token);
          this.props.navigation.navigate('App');
        } else {
          this.setState({ username: '', password: '', statusMsg: 'Invalid credentials.' });
        }
      })
      .catch(() => this.setState({ username: '', password: '', statusMsg: 'A network error occured.' }));
  }

  render() {
    return (
      <View style={{ padding: 10 }}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          placeholder="username"
          style={styles.input}
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <Text style={{ marginBottom: 20, color: 'red' }}>{ this.state.statusMsg }</Text>
        <Button title="Sign in" onPress={this.authAsync.bind(this)} />
        <Button title="Create Account" onPress={() => this.props.navigation.navigate('CreateAccount')} />
      </View>
    );
  }
}
