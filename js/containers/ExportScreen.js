import React, { Component } from 'react';
import {
  Image,
  View,
  Text,
  Button,
  TextInput,
} from 'react-native';
import { API_EXPORT, TEST_EMAIL } from '../config/constants';


export default class ExportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      big_text: '',
    };
    this.send_email = this.send_email.bind(this);
  }

  send_email(user_email) {
    //if (user_email == '') {
    //  this.setState({
    //    big_text: 'Please Enter an Email',
    //  });
    //}
    //else {
    //  this.setState({
    //    big_text: 'Email Sent',
    //  });
    //}
    fetch(API_EXPORT, {
      method: 'POST',
      header: 'Content-Type: application/json',
      credentials: 'same-origin',
      body: JSON.stringify({
        email: user_email
      })
    })
    .then((response) => {
      return response.json();
    }
    .catch(e => console.error('Error:', e));

  }

  render() {
    return(
      <View>
        <Text> {this.big_text} </Text>
        <TextInput
          onChangeText={(text) => this.setState({text})}
          placeholder="Enter Your Email Here!"
        />
        <Button>
          title="Send Email"
          onPress={() => { this.send_email(this.email) }}
        </Button>
      </View>
    );
  }
}
