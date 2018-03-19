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

export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);

    this.selectItem = this.selectItem.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });

  }

  selectItem(item) {
    this.props.navigation.navigate('Product', {
      picture: item['image_url'],
      name: item['title'],
      price: item['price'],
      url: item['product_url'],
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
  };

  render() {
    const { params } = this.props.navigation.state;
    const data = [
        {
            "key": 1,
            "image_url": "https://images-na.ssl-images-amazon.com/images/I/41PS6nLtWVL.jpg",
            "price": 1999,
            "product_url": "https://www.amazon.com/Wrangler-Authentics-Classic-Regular-Stonewash/dp/B00XKXO4OW?psc=1&SubscriptionId=AKIAIJQWJX5VNAVFF7DQ&tag=similo-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B00XKXO4OW",
            "title": "Wrangler Authentics Men's Classic Regular Fit Jean, Stonewash Mid, 38x32"
        },
        {
            "key": 2,
            "image_url": "https://images-na.ssl-images-amazon.com/images/I/414p7-yKYAL.jpg",
            "price": 1999,
            "product_url": "https://www.amazon.com/Wrangler-Authentics-Classic-Relaxed-Slate/dp/B074MGN4XG?psc=1&SubscriptionId=AKIAIJQWJX5VNAVFF7DQ&tag=similo-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B074MGN4XG",
            "title": "Wrangler Authentics Men's Classic Relaxed Fit Jean, Slate Flex, 38X34"
        }
    ]
    return (
      <FlatList
        data={data}
        renderItem={this._renderItem}
      />
    );
  }
}
