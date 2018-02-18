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
    const brand = params ? params.brand : null;
    const price = params ? params.price : null;
    const description = params ? params.description : null;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> {JSON.stringify(name)} </Text>
        <Text> By {JSON.stringify(brand)} </Text>
        <Text> Product Description </Text>
        <Text> {JSON.stringify(description)} </Text>
        <Text> ${JSON.stringify(price)} </Text>
        <Button
          title={this.state.btext}
          onPress={() => { this.saveItem() }}
        />
      </View>
    );
  }
}
