import React, { useState, useEffect } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';

import {
  Container,
  BarStatus,
  Line,
  PhotoAlbum,
  Music,
  Information,
  InformationAlbum,
  TitleMusic,
  Separator,
  AuthorName,
  InformationController,
  DescriptionDevices,
  Controller,
} from './styles';
import { useSelector } from 'react-redux';
import { selectThumbNail, selectAudioURI, selectTitle, selectAudioID, selectDownloadData, selectSoundStatus, selectAuthor, selectIsAudioOnly, selectIsRecently, selectPaused, setPaused, selectAccentColour, setAccentColour, selectPlayListName} from '../../../services/slices/navSlice';
import { Platform, View, Image } from 'react-native';
import { setTitle,  setAuthor, setThumbNail, setAudioID} from '../../../services/slices/navSlice';
import TrackPlayer, {Capability, useProgress, Event, useTrackPlayerEvents, State} from 'react-native-track-player';
import { useDispatch } from 'react-redux';
import { pickedColour } from '../../screens/Home/pickedHeaderColour';
import { LinearGradient } from 'expo-linear-gradient';
import ImageColors from 'react-native-image-colors'
import color from 'color'
export default function Player({navigation}) {
 
  const paused = useSelector(selectPaused);
  const [state, setState] = useState(null)
  //const [primaryColour, setPrimaryColour] = useState(null)
  const dispatch = useDispatch()
  const primaryColour = useSelector(selectAccentColour)
  const Title = useSelector(selectTitle)
  const ThumbNail = useSelector(selectThumbNail)
  const audiouURI = useSelector(selectAudioURI)
  const audioID = useSelector(selectAudioID)
  const downloadData = useSelector(selectDownloadData)
  const status = useSelector(selectSoundStatus)
  const Artist = useSelector(selectAuthor)
  const isAudioOnly = useSelector(selectIsAudioOnly)
  const isRecently =  useSelector(selectIsRecently)
  const playListName = useSelector(selectPlayListName)

  const progress = useProgress()

  //console.log(primaryColour)

 

  useEffect(() => {

    async function getPrimaryColors() {
   
      const result = await ImageColors.getColors(ThumbNail, {
        fallback: "#3f4d63",
        cache: false,
        key: '1',
        darkerColor: true,
      })

      const darkerColor = color(result.primary).darken(0.6).hex();

      dispatch(setAccentColour(darkerColor))
      //setPrimaryColour(result.secondary)
     
    }

    getPrimaryColors()


    
  }, [ThumbNail])

  //getPrimaryColors(ThumbNail)

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playThroughEarpieceAndroid: false
   });


   
  }, [])

  async function checkIsPlaying(){
    const state = await TrackPlayer.getState();

    
    setState(state)
  }

  checkIsPlaying()

  useEffect(() => {
    async function run(){
      if (!paused){
        TrackPlayer.play()
      } else {
        TrackPlayer.pause()
      }
    }

    run()

  }, [paused])

  useEffect(() => {
    if (state == State.Playing){
    
      dispatch(setPaused(false))
    } else if (state == State.Paused){
      dispatch(setPaused(true))
    }
  }, [state])

 


  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title, artist, artwork, id} = track || {};
        dispatch(setTitle(title))
        dispatch(setAuthor(artist))
        dispatch(setThumbNail(artwork))
        dispatch(setAudioID(id))
        
    }

    
});
 

 

  function handleNavigation(){
    if (isAudioOnly){
      navigation.navigate('MusicScreen', {thumbNail: ThumbNail,
        audioURI: audiouURI, 
        title: Title,
        downloadData: downloadData,
        audioID: audioID,
        artist: Artist,
        playListName: playListName,
        })
    }
    else {
      navigation.navigate('VideoScreen', {videoThumbNail: ThumbNail,
        audioURI: audiouURI, 
        videoTitle: Title,
        downloadData: downloadData,
        videoId: audioID,
        rId: audioID,
        Search: false,
        isPlaylist: false,
        artist: Artist,
        isRecently: isRecently
        })
    }
  }


  

  

  return (
   
    <TouchableOpacity style={{marginBottom: Platform.OS == 'ios' ? 80 : 50}} onPress={handleNavigation}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
        //style={styles.background}
      />
      
      <Container pickedColour={primaryColour}>
      
      <BarStatus>
          <Line progress={(progress.position / progress.duration) * 100} />
        </BarStatus>
        <PhotoAlbum
          source={{
            uri: ThumbNail,
          }}
        />
        <Music>
         
            <Information>
              <InformationAlbum>
                <TitleMusic >{Title}</TitleMusic>
                <Separator> • </Separator>
                <AuthorName>{Artist}</AuthorName>
              </InformationAlbum>
              <InformationController>
                <MaterialCommunityIcons
                  name="speaker-wireless"
                  size={14}
                  color="#FFF"
                />
                <DescriptionDevices>Available Devices</DescriptionDevices>
              </InformationController>
            </Information>
        
          
          <Controller onPress={() => dispatch(setPaused(!paused))}>
            {!paused && (
              <MaterialCommunityIcons name="pause" size={30} color="#FFF" />
            )}
            {paused && (
              <MaterialCommunityIcons name="play" size={30} color="#FFF" />
            )}
          </Controller>
        </Music>
      </Container>
      </TouchableOpacity>
      
  );
}
