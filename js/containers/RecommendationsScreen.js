import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class RecommendationsScreen extends Component {
  constructor(props) {
    super(props);

    this.selectItem = this.selectItem.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      name: item.name,
      brand: item.brand,
      price: item.price,
      description: item.Description,
    });
  }

  _renderItem = ({item}) => {
    const { params } = this.props.navigation.state.params;
    return (
      <View>
        <TouchableOpacity onPress={() => this.selectItem(item)}>
          <Text style={{ color: "black" }}>{item.name}</Text>
          <Text style={{ color: "black" }}>By {item.brand}</Text>
          <Text style={{ color: "black" }}>${item.price}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={[
          {key: 'a', name: 'Glasses', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'b', name: 'Glasses1', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'c', name: 'Glasses2', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'd', name: 'Glasses3', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'e', name: 'Glasses4', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'f', name: 'Glasses5', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'g', name: 'Glasses6', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'h', name: 'Glasses7', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'i', name: 'Glasses8', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'j', name: 'Glasses9', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
        ]}
        renderItem={this._renderItem}
      />
    );
  }
}
