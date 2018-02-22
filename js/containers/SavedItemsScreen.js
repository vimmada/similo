import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class SavedItemsScreen extends Component {
  constructor(props) {
    super(props);

    this.selectItem = this.selectItem.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      name: item.item_title,
      price: item.price,
      description: item.description,
    });
  }

  _renderItem = ({item}) => {
    const { params } = this.props.navigation.state;
    const photo = params ? params.photo : null;
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
          {key: 'f', name: 'Glasses5', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'i', name: 'Glasses8', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
          {key: 'j', name: 'Glasses9', brand: 'Alien', price: 100.00, Description: 'Slob on my Knob'},
        ]}
        renderItem={this._renderItem}
      />
    );
  }
}
