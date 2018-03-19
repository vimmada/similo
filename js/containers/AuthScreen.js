import React, { Component } from 'react';
import { AsyncStorage, Button, StyleSheet, TextInput, View } from 'react-native';

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

    this.state = { username: '', password: '' };
  }

  authAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
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
        <Button title="Sign in" onPress={this.authAsync} />
      </View>
    );
  }
}
