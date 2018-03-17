import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';

export default class RecommendationsScreen extends Component {
  constructor(props) {
    super(props);

    this.selectItem = this.selectItem.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      name: item['title'],
      price: item['price'],
      url: item['product_url'],
    });
  }

  _renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.selectItem(item)}>
          <Text style={{ color: "black" }}>{item['title']}</Text>
          <Text style={{ color: "black" }}>${item['price']}</Text>
        </TouchableOpacity>
      </View>
      <ListItem
        key={sectionID}
        title={item['title']}
        subtitle={item['price']}
        avatar={{uri:item['']}}
      />
    );
  };

  render() {
    const { params } = this.props.navigation.state;
    const data = params ? params.data : null;
    return (
      <FlatList
        data={data}
        renderItem={this._renderItem}
      />
    );
  }
}
