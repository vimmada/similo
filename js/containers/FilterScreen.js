import React, { Component } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';


export default class FilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keywords: [],
      min_price: 0,
      max_price: 9999999999,
    }
  }
  
  selectItem(item) {
    var picture = item['image_url'];
    if (!picture) {
      picture = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg'
    }
    this.props.navigation.navigate('Recommendations', {
      picture: picture,
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
    var price = "$";
    if (pnum.length === 1) {
      price = price + dollar;
    }
    else {
      price = price  + dollar + "." + cents;
    }
    var picture = item['image_url'];
    if (!picture) {
      picture = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg'
    }
    return (
      <ListItem
        key={item['image_url']}
        title={item['title']}
        subtitle={price}
        avatar={{uri:picture}}
        onPress={() => this.selectItem(item)}
      />
    );
  };

  render() {
    const { params } = this.props.navigation.state;
    const data = params ? params.data : null;
    return (
      <View>
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
        <Button
          title={'Apply'}
          onPress={() => { this.filterdata() }}
        />
      </View>
    );
  }
}
