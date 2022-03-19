import React from 'react';
import { StatusBar } from 'react-native';
import Routes from './src/Routes';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoDisplay from './src/screens/VideoDisplayScreen';
import Login from './src/screens/Authentication/Login';
import Register from './src/screens/Authentication/Register';
import MusicPlayer from './src/screens/MusicPlayer';
import VideoPlayer from './src/screens/VideoPlayer';
import { Provider } from 'react-redux';
import {store} from './services/store'


const Stack = createStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: "#141412",
    background: "#121212",
    card: "#141412",
    text: "#FFF",
    border: "#000"
  }
};

function MainPage(){
  return (
    <>
      <StatusBar
        backgroundColor="rgba(25,20,20,0.8)"
        barStyle="light-content"
      />

      <Routes />
    </>
  );
}

export default function App(){
  

  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Login'>
          <Stack.Screen name='Login' component={Login}></Stack.Screen>
          <Stack.Screen name='Register' component={Register}></Stack.Screen>
          <Stack.Screen name='Main' component={MainPage}></Stack.Screen>
          <Stack.Screen name='VideoScreen' component={VideoDisplay}></Stack.Screen>
          <Stack.Screen name='MusicScreen' component={MusicPlayer}></Stack.Screen>
          <Stack.Screen name='VideoPlayer' component={VideoPlayer}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
  
}

