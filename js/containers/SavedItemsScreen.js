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
import { API_SAVED_ITEMS, TEST_EMAIL } from '../config/constants';


export default class SavedItemsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
    this.selectItem = this.selectItem.bind(this);
    this.export = this.export.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

  }

  componentDidMount() {
    fetch(API_SAVED_ITEMS, {
      method: 'POST',
      header: 'Content-Type: application/json',
      credentials: 'same-origin',
      body: JSON.stringify({
        email: TEST_EMAIL,
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      this.
    })
    .catch(e => console.error(e));
  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      name: item['title'],
      price: item['price'],
      url: item['product_url'],
      picture: item['image_url'],
    });
  }

  export(data) {
    this.props.navigation.navigate('Export', {
      exports: data,
    });
  }

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
  );

  render() {
    const data = this.data;
    return (
      <View>
        <Button>
          title="Export Saved Items"
          onPress={() => { this.export(data) }}
        </Button>
        <FlatList
          data={data}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}
