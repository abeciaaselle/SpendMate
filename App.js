import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import Add from './screens/Add';
import LandingPage from './screens/LandingPage';
import SignupPage from './screens/SignupPage';
import RecoveryPage from './screens/RecoveryPage'; // Import the RecoveryPage component

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignupPage" component={SignupPage} />
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="RecoveryPage" component={RecoveryPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
