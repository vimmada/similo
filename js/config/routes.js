import React from 'react';
import { TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import AdvancedSearchScreen from '../containers/AdvancedSearchScreen';
import BufferScreen from '../containers/BufferScreen';
import ConfirmScreen from '../containers/ConfirmScreen';
import FilterScreen from '../containers/FilterScreen';
import HomeScreen from '../containers/HomeScreen';
import HistoryScreen from '../containers/HistoryScreen';
import RecommendationsScreen from '../containers/RecommendationsScreen';
import ProductScreen from '../containers/ProductScreen';
import UploadPhotoScreen from '../containers/UploadPhotoScreen';
import SavedItemsScreen from '../containers/SavedItemsScreen';
import SettingsScreen from '../containers/SettingsScreen';

const stackRoutes = {
  AdvancedSearch: {
    screen: AdvancedSearchScreen,
  },
  Buffer: {
    screen: BufferScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};

      return {
        title: 'Searching',
        headerRight: (
          <TouchableOpacity onPress={params.getRecommendations}>
            <FontAwesome name="chevron-right" size={24} />
          </TouchableOpacity>
        ),
      };
    },
  },
  Confirm: {
    screen: ConfirmScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};

      return {
        title: 'Confirm',
        headerLeft: (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="chevron-left" size={24} />
          </TouchableOpacity>
        ),
        headerRight: (
          <TouchableOpacity onPress={params.uploadPhoto}>
            <FontAwesome name="chevron-right" size={24} />
          </TouchableOpacity>
        ),
      };
    },
  },
  Filter: {
    screen: FilterScreen,
  },
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
        title: 'Similo',
      };
    },
  },
  History: {
    screen: HistoryScreen,
  },
  Recommendations: {
    screen: RecommendationsScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
        title: 'Search Results',
      };
    },
  },
  Product: {
    screen: ProductScreen,
  },
  SavedItems: {
    screen: SavedItemsScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
        title: 'Saved Items',
      };
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};
      return {
        title: 'Settings',
      };
    },
  },
  UploadPhoto: {
    screen: UploadPhotoScreen,
    navigationOptions: ({ navigation }) => {
      const params = navigation.state.params || {};

      return {
        title: 'Upload Photo',
        headerRight: (
          <TouchableOpacity onPress={params.navigateToConfirm}>
            <FontAwesome name="chevron-right" size={24} />
          </TouchableOpacity>
        ),
      };
    },
  },
};

const stackConfig = {
  navigationOptions: ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity
        onPress={() => navigation.navigate('DrawerOpen')}
      >
        <FontAwesome name="bars" size={24} />
      </TouchableOpacity>
    ),
    headerStyle: {
      paddingLeft: 10,
      paddingRight: 10,
    },
  }),
};

const drawerRoutes = {
  HomeStack: {
    screen: StackNavigator(stackRoutes, {
      ...stackConfig,
      initialRouteName: 'Home',
    }),
    navigationOptions: {
      drawerLabel: 'Take Photo',
      drawerIcon: () => <FontAwesome name="camera" size={24} />,
    },
  },
  SavedStack: {
    screen: StackNavigator(stackRoutes, {
      ...stackConfig,
      initialRouteName: 'SavedItems',
    }),
    navigationOptions: {
      drawerLabel: 'Saved Items',
      drawerIcon: () => <FontAwesome name="bookmark" size={24} />,
    },
  },
  SettingsStack: {
    screen: StackNavigator(stackRoutes, {
      ...stackConfig,
      initialRouteName: 'Settings',
    }),
    navigationOptions: {
      drawerLabel: 'Settings',
      drawerIcon: () => <FontAwesome name="cog" size={24} />,
    },
  },
  UploadPhotoStack: {
    screen: StackNavigator(stackRoutes, {
      ...stackConfig,
      initialRouteName: 'UploadPhoto',
    }),
    navigationOptions: {
      drawerLabel: 'Upload Photo',
      drawerIcon: () => <FontAwesome name="cloud-upload" size={24} />,
    },
  },
};

const drawerConfig = {
  initialRouteName: 'HomeStack',
  order: [
    'HomeStack',
    'UploadPhotoStack',
    'SavedStack',
    'SettingsStack',
  ],
};

const RootNavigation = StackNavigator(
  {
    Drawer: {
      screen: DrawerNavigator(drawerRoutes, drawerConfig),
    },
    ...stackRoutes,
  },
  {
    ...stackConfig,
    headerMode: 'none',
  },
);

export default RootNavigation;
