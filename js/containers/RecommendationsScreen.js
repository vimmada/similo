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
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import { colors } from '../config/styles';

const { SIMILO_BLUE } = colors;

export default class RecommendationsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Recommendations',
    headerLeft: (
      <TouchableOpacity
        onPress={() => {
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Home' })],
          });

          navigation.dispatch(resetAction);
        }}
        style={{ marginLeft: 20 }}
      >
        <Icon name="home" size={24} color={SIMILO_BLUE} />
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      alignSelf: 'center',
    },
  });

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
    const { params } = this.props.navigation.state;
    const data = params ? params.data : null;
    return (
      <FlatList
        data={data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}
