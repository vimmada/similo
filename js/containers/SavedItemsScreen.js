import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { API_SAVED_ITEMS, TEST_EMAIL } from '../config/constants';


export default class SavedItemsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
    this.selectItem = this.selectItem.bind(this);
    this._export = this._export.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });
  }

  componentDidMount() {
    AsyncStorage.getItem('userToken')
      .then(userToken => {
        fetch(API_SAVED_ITEMS, { headers: { 'Authorization': userToken }})
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          this.setState({
            data: data.items,
          });
        })
        .catch(e => console.error(e));
      })
  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      name: item['title'],
      price: item['price'],
      url: item['product_url'],
      picture: item['image_url'],
      item_id: item['item_id'],
      saved: true,
    });
  }

  _export(data) {
    // TODO
    // this.props.navigation.navigate('Export', {
    //   exports: data,
    // });
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
  }

  render() {
    const data = this.state.data;
    return (
      <View>
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
        <Button
          title="Export Saved Items"
          onPress={() => { this._export(data) }}
        />
      </View>
    );
  }
}
