import React from 'react';
import { Button, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

function HomeScreen(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Similo</Text>
      <Button
        title="Go to Confirmation"
        onPress={() => props.navigation.navigate('Confirm')}
      />
    </View>
  );
}

function ConfirmScreen(props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Confirm</Text>
      <Button
        title="Go Back!"
        onPress={() => props.navigation.goBack()}
      />
    </View>
  );
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Confirm: {
      screen: ConfirmScreen,
    }
  },
  {
    initialRouteName: 'Home',
  },
);

export default function App() {
  return <RootStack />;
}
