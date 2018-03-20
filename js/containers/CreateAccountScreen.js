import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { createAccount } from '../lib';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 20,
    height: 40,
    marginBottom: 20,
  },
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
      firstname: '',
      lastname: '',
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
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="email"
          style={styles.input}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          style={styles.input}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <TextInput
          autoCorrect={false}
          placeholder="First name"
          style={styles.input}
          value={this.state.firstname}
          onChangeText={firstname => this.setState({ firstname })}
        />
        <TextInput
          autoCorrect={false}
          placeholder="Last name"
          style={styles.input}
          value={this.state.lastname}
          onChangeText={lastname => this.setState({ lastname })}
        />
        <Text style={{ marginBottom: 20, color: 'red' }}>{ this.state.statusMsg }</Text>
        <Button title="Create account" onPress={this.createAccount} />
      </View>
    );
  }
}
