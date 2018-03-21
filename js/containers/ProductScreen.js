import React, { Component } from 'react';
import {
  AsyncStorage,
  Image,
  View,
  Text,
  Button,
} from 'react-native';
import { API_SAVED_ITEMS } from '../config/constants';


export default class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      btext: 'Save Item',
    };
    this.saveItem = this.saveItem.bind(this);
  }

  saveItem = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this.setState({
      saved: true,
      btext: 'Item Saved',
    });
    const { params } = this.props.navigation.state;
    const name = params ? params.name : null;
    const price = params ? params.price : null;
    const url = params ? params.url : null;
    const picture = params ? params.picture : null;
    fetch(API_SAVED_ITEMS, {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({
        item: {
          title: name,
          description: 'Description',
          image_url: picture,
          product_url: url,
          price: price,
        },
      }),
      headers: {
        'Authorization': userToken,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
  }

  render() {
    const { params } = this.props.navigation.state;
    const name = params ? params.name : null;
    const price = params ? params.price : null;
    const url = params ? params.url : null;
    const picture = params ? params.picture : null;

    var pnum = price.toString();
    var dollar = pnum.substring(0, pnum.length - 2);
    var cents = pnum.substring(pnum.length-2, pnum.length);
    var Price = "$" + dollar + "." + cents;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{width: 200, height: 200}}
          source={{uri: picture}}
        />
        <Text> {name} </Text>
        <Text> Link: {url} </Text>
        <Text> {Price} </Text>
        <Button
          title={this.state.btext}
          onPress={() => { this.saveItem() }}
        />
      </View>
    );
  }
}
