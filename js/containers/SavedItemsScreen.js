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
        item: {
          title
        }
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((data))
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
    const data = [
      {
          "key": 'a',
          "image_url": 'https://images-na.ssl-images-amazon.com/images/I/71p0O0O-YVL._UX522_.jpg',
          "title": 'Clout Glasses',
          "price": 10000,
          "product_url": "https://www.amazon.com"
      },
      {
           "key": 'f',
           "image_url": "http://streetwearmuse.com/image/cache/data/2015/Supreme/Fitted%20Hats/supreme-box-wool-fitted-hats-gray-streetwearvilla-900x900.png",
           "title": 'Supreme Gray Hat',
           "price": 10000,
           "product_url": "https://www.amazon.com"
      },
      {
           "key": 'i',
           "image_url": 'https://stockx.imgix.net/products/streetwear/Supreme-The-North-Face-Mountain-6-Panel-Hat-Black.jpg?fit=fill&bg=FFFFFF&w=1400&h=1000&auto=format,compress&trim=color&q=40',
           "title": 'North Face - Supreme Hat',
           "price": 10000,
           "product_url": "https://www.amazon.com"
      },
      {
           "key": 'j',
           "image_url": 'https://c.static-nike.com/a/images/t_PDP_1280_v1/f_auto/frxshiomzzaqcjxssvoc/roshe-one-womens-shoe-ol9k1O.jpg',
           "title": "Nike Roshe One Women's Shoe",
           "price": 10000,
           "product_url": "https://www.amazon.com"
      },
      {
          "key": 'b',
          "image_url": 'https://i.ytimg.com/vi/pyQCbtqN89c/maxresdefault.jpg',
          "title": 'Galaxy Roshe Run One',
          "price": 10000,
          "product_url": "https://www.amazon.com"
      },
      {
           "key": 'c',
           "image_url": "https://s7d2.scene7.com/is/image/dkscdn/17ADIBTRCKSTJCKTXAPT_Legend_Ink_is",
           "title": 'Adidas Originals Challenger Track Jacket',
           "price": 10000,
           "product_url": "https://www.amazon.com"
      },
      {
           "key": 'd',
           "image_url": 'https://cdn.shopify.com/s/files/1/0293/9277/products/Fashion_Nova_07-02_23_1000x.JPG?v=1517613347',
           "title": 'Classy Mid Rise Skinny Jeans',
           "price": 10000,
           "product_url": "https://www.amazon.com"
      },
      {
           "key": 'e',
           "image_url": 'https://res.cloudinary.com/teepublic/image/private/s--gEQZSpwb--/t_Resized%20Artwork/c_crop,x_10,y_10/c_fit,h_626/c_crop,g_north_west,h_626,w_470,x_-38,y_0/g_north_west,u_upload:v1462829024:production:blanks:a59x1cgomgu5lprfjlmi,x_-433,y_-325/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1494531234/production/designs/1597567_1.jpg',
           "title": 'Chewbacca Hipster T-Shirt',
           "price": 10000,
           "product_url": "https://www.amazon.com"
      },
    ];
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
