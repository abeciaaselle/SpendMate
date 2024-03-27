// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import Add from './screens/Add';
import LandingPage from './screens/LandingPage';

const Stack = createStackNavigator();

export default function App() {
  const onStart = (name) => {
    // Navigate to HomeScreen with the provided name
    navigation.navigate('Home', { name });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingPage">
          {(props) => <LandingPage {...props} onStart={onStart} />}
        </Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={Add} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
