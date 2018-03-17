'use strict';

import { StackNavigator } from 'react-navigation';

import AdvancedSearchScreen from '../containers/AdvancedSearchScreen';
import BufferScreen from '../containers/BufferScreen';
import FilterScreen from '../containers/FilterScreen';
import HomeScreen from '../containers/HomeScreen';
import HistoryScreen from '../containers/HistoryScreen';
import ProductScreen from '../containers/ProductScreen';
import RecommendationsScreen from '../containers/RecommendationsScreen';
import SavedItemsScreen from '../containers/SavedItemsScreen';
import SettingsScreen from '../containers/SettingsScreen';

const RootNavigator = StackNavigator(
  {
    AdvancedSearch: {
      screen: AdvancedSearchScreen,
    },
    Buffer: {
      screen: BufferScreen,
    },
    Filter: {
      screen: FilterScreen,
    },
    Home: {
      screen: HomeScreen,
    },
    History: {
      screen: HistoryScreen,
    },
    Product: {
      screen: ProductScreen,
    },
    Recommendations: {
      screen: RecommendationsScreen,
    },
    SavedItems: {
      screen: SavedItemsScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default RootNavigator;
