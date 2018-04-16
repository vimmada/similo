import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
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
    this.state = {
      namesorted: 0,
      pricesorted: 0,
      r_max: 99999999,
      r_min: 0,
      max: 99999999,
      min: 0,
      data: [],
      alt_data: [],
      psort: 'Sort By Price: Low to High',
      nsort: 'Sort By Name: A-Z',
      min_filt: false,
      max_filt: false,
    };

    this.sortName = this.sortName.bind(this);
    this.sortItem = this.sortItem.bind(this);
    this.filterItem = this.filterItem.bind(this);
    this.filterMin = this.filterMin.bind(this);
    this.filterMax = this.filterMax.bind(this);

    this.props.navigation.setParams({ selectItem: this.selectItem });
  }

  componentDidMount(){
    const { params } = this.props.navigation.state;
    const data = params ? params.data : null;
    if (data) {
      this.setState({
        data,
        alt_data: data
      });
    }
  }

  sortName() {
    var newdata = this.state.alt_data;
    if (this.state.namesorted === 1) {
      newdata.sort(function(a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // names must be equal
        return 0;
      });
      this.setState({
        namesorted: 2,
        alt_data: newdata,
        nsort: 'Sort By Name: A-Z',
      });
    } else {
      newdata.sort(function(a, b) {
        var nameA = a.title.toUpperCase(); // ignore upper and lowercase
        var nameB = b.title.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      this.setState({
        namesorted: 1,
        alt_data: newdata,
        nsort: 'Sort By Name: Z-A',
      });
    }
  }

  sortItem() {
    // sort by value
    var newdata = this.state.alt_data;
    if (this.state.pricesorted === 1) {
      newdata.sort(function(a, b) {
        var priceA = a.price; // ignore upper and lowercase
        var priceB = b.price;
        if (priceA < priceB) {
          return 1;
        }
        if (priceA > priceB) {
          return -1;
        }
        // names must be equal
        return 0;
      });
      this.setState({
        pricesorted: 2,
        alt_data: newdata,
        psort: 'Sort By Price: Low to High',
      });
    } else {
      newdata.sort(function(a, b) {
        var priceA = a.price; // ignore upper and lowercase
        var priceB = b.price;
        if (priceA < priceB) {
          return -1;
        }
        if (priceA > priceB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      this.setState({
        pricesorted: 1,
        alt_data: newdata,
        psort: 'Sort By Price: High to Low',
      });
    }
  }

  filterItem(query) {
    var fmin = this.state.min;
    var fmax = this.state.max;
    this.setState({
      alt_data: this.state.data.filter(function(el) {
        return el.title.toLowerCase().indexOf(query.toLowerCase()) > -1 && el.price >= fmin && el.price <= fmax;
      }),
    });
  }

  filterMin(min) {
    if (min) {
      if (this.state.max_filt) {
        var fmax = this.state.max;
        this.setState({
          alt_data: this.state.data.filter(function(el) {
            return el.price >= min && el.price <= fmax;
          }),
          min,
          min_filt: true
        });
      }
      else {
        this.setState({
          alt_data: this.state.data.filter(function(el) {
            return el.price >= min;
          }),
          min,
          min_filt: true
        });
      }
    } else {
      var reset = this.state.r_min;
      this.setState({
        alt_data: this.state.data.filter(function(el) {
          return el.price >= reset;
        }),
        min: reset,
        min_filt: false
      });
    }
  }

  filterMax(max) {
    if (max) {
      this.setState({
        alt_data: this.state.data.filter(function(el) {
          return el.price <= max;
        }),
        max,
        max_filt: true
      });
      if (this.state.min_filt) {
        var fmin = this.state.min;
        this.setState({
          alt_data: this.state.data.filter(function(el) {
            return el.price >= fmin && el.price <= max;
          }),
          max,
          max_filt: true
        });
      }
      else {
        this.setState({
          alt_data: this.state.data.filter(function(el) {
            return el.price <= max;
          }),
          max,
          max_filt: true
        });
      }
    } else {
      var reset = this.state.r_max;
      this.setState({
        alt_data: this.state.data.filter(function(el) {
          return el.price <= reset;
        }),
        max: reset,
        max_filt: false
      });
    }
  }

  selectItem(item) {
    var picture = item['image_url'];
    if (!picture) {
      picture = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg'
    }
    this.props.navigation.navigate('Product', {
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
    else if(pnum.length === 0) {
      price = "No Price Found"
    }
    else {
      price = price  + dollar + "." + cents;
    }
    var picture = item['image_url'];
    if (!picture) {
      picture = 'http://vollrath.com/ClientCss/images/VollrathImages/No_Image_Available.jpg'
    }
    return (
      <TouchableOpacity onPress={() => this.selectItem(item)}>
        <View>
          <Image
            style={styles.logo}
            source={{ uri: picture }}
            resizeMode="stretch"
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text
              style={{
                textAlign: 'center',
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {' '}{item.title}{' '}
            </Text>
          </View>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            {' '}{price}{' '}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { params } = this.props.navigation.state;
    const data = params ? params.data : null;
    if (data) {
      return (
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={this.sortItem} style={styles.button}>
              <Text style={{ color: 'white' }}> {this.state.psort} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.sortName} style={styles.button}>
              <Text style={{ color: 'white' }}> {this.state.nsort} </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{margin: 10}}>Filter Keywords</Text>
            <TextInput
              style={{
                height: 40,
                width: 200,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onChangeText={text => this.filterItem(text)}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{margin: 20}}>Min Price</Text>
            <TextInput
              style={{
                height: 40,
                width: 70,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
              }}
              onChangeText={text => this.filterMin(text)}
            />
            <Text style={{margin: 20}}>Max Price</Text>
            <TextInput
              style={{
                height: 40,
                width: 70,
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
                marginTop: 10
              }}
              onChangeText={text => this.filterMax(text)}
            />
          </View>
          <FlatList
            horizontal={false}
            numColumns={2}
            data={this.state.alt_data}
            extraData={this.state}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        </View>
      );
    }
    else {
      return (
        <View>
          <Text
            style={{
              textAlign: 'center',
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            `Oops! We couldn't find any recommendations based on your upload. Please try again, and try the following:`
            {' '}
            {'\n'}
            1. Focus on the item to increase image quality.{'\n'}
            2. Take a photo from a different angle for a more direct image.
            {'\n'}
            3. Minimize any movement that may cause blur.{'\n'}
            4. Crop your image more close to the item(s) of interest.{'\n'}
            5. Adjust lightning to increase image clarity.
          </Text>
        </View>
      );
    }
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
    backgroundColor: '#056ecf',
    height: 220,
    width: 180,
    margin: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#4285f4',
    padding: 10,
    borderRadius: 10,
    margin: 10
  },
});
