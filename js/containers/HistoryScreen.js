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
import { API_HISTORY } from '../config/constants';

import { uploadPhoto } from '../lib';

export default class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }

    this.searchItem = this.searchItem.bind(this);

    this.props.navigation.setParams({ searchItem: this.searchItem });
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

  searchItem(item) {
    uploadPhoto.call(this, { data: item.image });
  }

  _keyExtractor = (item, index) => item.date_created;

  _renderItem = ({item}) => {
    const timeAgo = moment(item.date_created).fromNow();
    return (
      <TouchableOpacity onPress={this.searchItem(item)}>
        <View>
          <Image
            style={styles.logo}
            source={{uri: `data:image/png;base64,${item.image}`}}>
          </Image>
          <Text style={{textAlign: 'center'}}> Searched on {item.date_created} </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal={false}
          numColumns={2}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  logo: {
    height: 220,
    width: 180,
    margin: 10,
  },
});
