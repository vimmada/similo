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
    this.export = this.export.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

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
      <View>
        <TouchableOpacity onPress={() => this.selectItem(item)}>
          <Image
            style={{width: 50, height: 50}}
            source={{uri: {item['picture']}}}
          />
          <Text style={{ color: "black" }}>{item['title']}</Text>
          <Text style={{ color: "black" }}>{price}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const data = [
      {"key": 'a', "image_url": 'https://images-na.ssl-images-amazon.com/images/I/71p0O0O-YVL._UX522_.jpg', "title": 'Glasses1', "price": 10000, "product_url": "https://www.amazon.com"},
      {"key": 'f', "image_url": 'https://images-na.ssl-images-amazon.com/images/I/71p0O0O-YVL._UX522_.jpg', "title": 'Glasses5', "price": 10000, "product_url": "https://www.amazon.com"},
      {"key": 'i', "image_url": 'https://images-na.ssl-images-amazon.com/images/I/71p0O0O-YVL._UX522_.jpg', "title": 'Glasses8', "price": 10000, "product_url": "https://www.amazon.com"},
      {"key": 'j', "image_url": 'https://images-na.ssl-images-amazon.com/images/I/71p0O0O-YVL._UX522_.jpg', "title": 'Glasses9', "price": 10000, "product_url": "https://www.amazon.com"},
    ];
    return (
      <Button>
        title="Export Saved Items"
        onPress={() => { this.export(data) }}
      </Button>
      <FlatList
        data={data}
        renderItem={this._renderItem}
      />
    );
  }
}
