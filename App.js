import React,{useEffect} from 'react';
import { StatusBar, ImageBackground, StyleSheet, LogBox } from 'react-native';
import Routes from './src/Routes';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import VideoDisplay from './src/screens/VideoDisplayScreen';
import Login from './src/screens/Authentication/Login';
import Register from './src/screens/Authentication/Register';
import MusicPlayer from './src/screens/MusicPlayer';
import VideoPlayer from './src/screens/VideoPlayer';
import AlbumScreen from './src/screens/AlbumScreen';
import NamePlaylist from './src/screens/CreatePlaylist/NamePlaylist';
import AddToPlaylist from './src/screens/CreatePlaylist/AddToPlaylist';
import AddToMadePlaylist from './src/screens/CreatePlaylist/AddToMadePlayList';
import TopicContent from './src/screens/TopicContent/TopicContent';
import PlaylistOptions from './src/screens/CreatePlaylist/PlaylistOptions';
import ChannelScreen from './src/screens/AlbumScreen/ChannelScreen';
import MoreOptions from './src/screens/MoreOptions/MoreOptions';
import SavedMoreOptions from './src/screens/MoreOptions/SavedMoreOptions';
import { Provider } from 'react-redux';
import {store} from './services/store'
import { BG_IMAGE } from './src/services/backgroundImage';
//import PictureInPicture from 'react-native-picture-in-picture';
//import TrackPlayer from 'react-native-track-player';

//LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message



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
    
      
    <ImageBackground style={styles.image} resizeMode="cover" source={ BG_IMAGE}>
      <StatusBar
        //backgroundColor="rgba(25,20,20,0.8)"
        barStyle="light-content"
      />
      <Routes />
    </ImageBackground>
  );
}






export default function App(){

  
    
  
  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: true, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS}} initialRouteName='Login'>
          <Stack.Screen name='Login' component={Login}></Stack.Screen>
          <Stack.Screen name='Register' component={Register}></Stack.Screen>
          <Stack.Screen name='Main' component={MainPage}></Stack.Screen>
          <Stack.Screen name='VideoScreen' component={VideoDisplay}></Stack.Screen>
          <Stack.Screen name='MusicScreen' component={MusicPlayer}></Stack.Screen>
          <Stack.Screen name='VideoPlayer' component={VideoPlayer}></Stack.Screen>
          <Stack.Screen name='AlbumScreen' component={AlbumScreen}></Stack.Screen>
          <Stack.Screen name='ChannelScreen' component={ChannelScreen}></Stack.Screen>
          <Stack.Screen name='NamePlaylist' component={NamePlaylist}></Stack.Screen>
          <Stack.Screen name='AddToPlaylist' component={AddToPlaylist}></Stack.Screen>
          <Stack.Screen name='AddToMadePlaylist' component={AddToMadePlaylist}></Stack.Screen>
          <Stack.Screen name='TopicContent' component={TopicContent}></Stack.Screen>
          <Stack.Screen name='PlayListOptions' component={PlaylistOptions}></Stack.Screen>
          <Stack.Screen name='MoreOptions' component={MoreOptions}></Stack.Screen>
          <Stack.Screen name='SavedMoreOptions' component={SavedMoreOptions}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
  
}

const styles = StyleSheet.create({
 
  image: {
    flex: 1,
    justifyContent: "center"
  },
 
});

//registerRootComponent(App);