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
    };
    this.send_email = this.send_email.bind(this);
  }

  send_email(email) {
    
  }

  render() {
    return(
      <View>
        <TextInput

        />
        <Button>
          title="Send Email"
          onPress={() => { this.send_email(this.email) }}
        </Button>
      </View>
    );
  }
}
