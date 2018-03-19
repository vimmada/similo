import React, { Component } from 'react';
import {
  Image,
  View,
  Text,
  Button,
} from 'react-native';

export default class ProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saved: false,
      btext: 'Save Item',
    };
    this.saveItem = this.saveItem.bind(this);
  }

  saveItem() {
    this.setState({
      saved: true,
      btext: 'Item Saved',
    });
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
