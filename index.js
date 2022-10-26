
import App from './App';
import TrackPlayer from 'react-native-track-player';
import { registerRootComponent } from "expo"
 
registerRootComponent(App);
 
TrackPlayer.registerPlaybackService(() => require('./service'));
 