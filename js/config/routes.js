import { StackNavigator, SwitchNavigator } from 'react-navigation';

import AdvancedSearchScreen from '../containers/AdvancedSearchScreen';
import AuthLoadingScreen from '../containers/AuthLoadingScreen';
import AuthScreen from '../containers/AuthScreen';
import BufferScreen from '../containers/BufferScreen';
import ExportScreen from '../containers/ExportScreen';
import CreateAccountScreen from '../containers/CreateAccountScreen.js';
import FilterScreen from '../containers/FilterScreen';
import HomeScreen from '../containers/HomeScreen';
import HistoryScreen from '../containers/HistoryScreen';
import ProductScreen from '../containers/ProductScreen';
import RecommendationsScreen from '../containers/RecommendationsScreen';
import SavedItemsScreen from '../containers/SavedItemsScreen';

const AppNavigator = StackNavigator(
  {
    AdvancedSearch: {
      screen: AdvancedSearchScreen,
    },
    Buffer: {
      screen: BufferScreen,
    },
    Export: {
      screen: ExportScreen,
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
  },
  {
    initialRouteName: 'Home',
  },
);

const AuthNavigator = StackNavigator(
  {
    Login: {
      screen: AuthScreen,
    },
    CreateAccount: {
      screen: CreateAccountScreen,
    },
  },
  {
    initialRouteName: 'Login',
  },
);

const RootNavigator = SwitchNavigator(
  {
    App: AppNavigator,
    Auth: AuthNavigator,
    AuthLoading: AuthLoadingScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default RootNavigator;
