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
import { selectPhotoFromGallery, takePhotoWithCamera } from '../lib';

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
      psort: '$ (Low to High)',
      nsort: 'Name (A-Z)',
      min_filt: false,
      max_filt: false,
    };

    this.sortName = this.sortName.bind(this);
    this.sortItem = this.sortItem.bind(this);
    this.filterItem = this.filterItem.bind(this);
    this.filterMin = this.filterMin.bind(this);
    this.filterMax = this.filterMax.bind(this);
    this.relevance = this.relevance.bind(this);

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

  relevance() {
    const alt_data = this.state.data.slice(0);
    this.setState({
      alt_data,
    });
  }

  sortName() {
    var newdata = this.state.alt_data;
    if (this.state.namesorted === 1) {
      newdata.sort(function(a, b) {
        var nameA = a.title.toLowerCase(); // ignore upper and lowercase
        var nameB = b.title.toLowerCase(); // ignore upper and lowercase
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
        nsort: 'Name (A-Z)',
      });
    } else {
      newdata.sort(function(a, b) {
        var nameA = a.title.toLowerCase(); // ignore upper and lowercase
        var nameB = b.title.toLowerCase(); // ignore upper and lowercase
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
        nsort: 'Name (Z-A)',
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
        psort: '$ (Low to High)',
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
        psort: '$ (High to Low)',
      });
    }
  }

  filterItem(query) {
    var fmin = this.state.min;
    var fmax = this.state.max;

    const termsDict = {};
    const termsList = query.split(' ');

    for (let term of termsList) {
      if (term) {
        termsDict[term.toLowerCase()] = true;
      }
    }

    this.setState({
      alt_data: this.state.data.filter(function(el) {
        const title = el.title.toLowerCase()

        for (let term in termsDict) {
          if (title.indexOf(term) === -1) {
            return false;
          }
        }

        return true;
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
    var price = "No Price Found";
    if (pnum.length === 1) {
      price = "$" + dollar;
    }
    else {
      price = "$"  + dollar + "." + cents;
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
            resizeMode="center"
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
            {' '}{price === '$' ? 'Price not available' : price}{' '}
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
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <Text style={{margin: 10, width: '10%'}}>Sort: </Text>
            <TouchableOpacity onPress={this.sortItem} style={styles.button}>
              <Text style={{ color: 'white', fontSize: 12 }} textAlignVertical='center'> {this.state.psort} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.sortName} style={styles.button}>
              <Text style={{ color: 'white', fontSize: 12 }} textAlignVertical='center'> {this.state.nsort} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.relevance} style={styles.button}>
              <Text style={{ color: 'white', fontSize: 12 }} textAlignVertical='center'> Relevance </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <Text style={{margin: 10, width: '10%'}}>Filter: </Text>
            <TextInput
              style={{
                height: 40,
                width: '80%',
                borderColor: 'gray',
                borderWidth: 1,
                borderRadius: 10,
              }}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder='space-separated, case-insensitive keywords'
              onChangeText={text => this.filterItem(text)}
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
        <View style={{flex: 1, alignItems: 'center', backgroundColor: '#4285f4'}}>
          <Text style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#FFFFFF',
              margin: 10
            }}
          >
            OOPS!
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#FFFFFF',
              textAlign: 'left',
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 20,
            }}>
            We couldn't find any recommendations based on your upload. Please try again, and try the following:
            {'\n'}
            {'\n'}
            1. Focus on the item to increase image quality.{'\n'}
            2. Take a photo from a different angle for a more direct image.
            {'\n'}
            3. Minimize any movement that may cause blur.{'\n'}
            4. Crop your image more close to the item(s) of interest.{'\n'}
            5. Adjust lightning to increase image clarity.{'\n'}
            6. Make sure you are taking a photo of clothing!
          </Text>
          <TouchableOpacity style={styles.touchableMenuItem}>
            <Icon.Button
              name="camera"
              size={30}
              onPress={takePhotoWithCamera.bind(this)}
              backgroundColor={SIMILO_BLUE}
              borderColor='#FFFFFF'
              borderWidth={1}
              borderRadius={10}
            >
              <Text style={styles.menuText}>Take Photo</Text>
            </Icon.Button>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchableMenuItem}>
            <Icon.Button
              name="image"
              size={30}
              onPress={selectPhotoFromGallery.bind(this)}
              backgroundColor={SIMILO_BLUE}
              borderColor='#FFFFFF'
              borderWidth={1}
              borderRadius={10}
            >
              <Text style={styles.menuText}>Upload Photo</Text>
            </Icon.Button>
          </TouchableOpacity>
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
    backgroundColor: 'white',
  },
  logo: {
    height: 220,
    width: 160,
    margin: 10,
  },
  button: {
    backgroundColor: SIMILO_BLUE,
    alignItems: 'center',
    backgroundColor: '#4285f4',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    width: '25%',
  },
  touchableMenuItem: {
    width: '80%',
    marginBottom: 30,
  },
  menuText: {
    fontSize: 24,
    color: '#FFFFFF',
  }
});

// <View style={{ flexDirection: 'row' }}>
//   <Text style={{margin: 20}}>Min Price</Text>
//   <TextInput
//     style={{
//       height: 40,
//       width: 70,
//       borderColor: 'gray',
//       borderWidth: 1,
//       borderRadius: 10,
//     }}
//     onChangeText={text => this.filterMin(text)}
//   />
//   <Text style={{margin: 20}}>Max Price</Text>
//   <TextInput
//     style={{
//       height: 40,
//       width: 70,
//       borderColor: 'gray',
//       borderWidth: 1,
//       borderRadius: 10,
//       marginTop: 10
//     }}
//     onChangeText={text => this.filterMax(text)}
//   />
// </View>
