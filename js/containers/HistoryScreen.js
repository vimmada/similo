import React, { Component } from 'react';
import moment from 'moment';
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

import { uploadPhoto } from '../lib';

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
            data: data.history.reverse(),
          });
        })
        .catch(e => console.error(e));
      });
  }

  selectItem(item) {
    uploadPhoto.call(this, { data: item.image });
  }

  _keyExtractor = (item, index) => item.date_created;

  _renderItem = ({item}) => {
    const timeAgo = moment(item.date_created).fromNow();
    return (
      <ListItem
        avatar={{ uri: `data:image/png;base64,${item.image}` }}
        title={`Searched ${timeAgo}`}
        key={item.dateCreated}
        onPress={() => this.selectItem(item)}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}
