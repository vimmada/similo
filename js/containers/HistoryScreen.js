import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { API_HISTORY, TEST_EMAIL } from '../config/constants';

export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.selectItem = this.selectItem.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

  }

  componentDidMount() {
    AsyncStorage.getItem('userToken')
      .then(userToken => {
        fetch(API_HISTORY, { headers: { 'Authorization': userToken }})
        .then((response) => {
          if (!response.ok) throw Error(response.statusText)
          return response.json();
        })
        .then((data) => {
          this.setState({
            data: data.items,
          });
        })
        .catch(e => console.error(e));
      });
  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      picture: item['image_url'],
      name: item['title'],
      price: item['price'],
      url: item['product_url'],
    });
  }

  _keyExtractor = (item, index) => item.product_url;

  _renderItem = ({item}) => {
    var pnum = item['price'].toString();
    var dollar = pnum.substring(0, pnum.length - 2);
    var cents = pnum.substring(pnum.length-2, pnum.length);
    var price = "$" + dollar + "." + cents;
    return (
      <ListItem
        key={item['image_url']}
        title={item['title']}
        subtitle={price}
        avatar={{uri:item['image_url']}}
        onPress={() => this.selectItem(item)}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}
