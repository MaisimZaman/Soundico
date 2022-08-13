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
import { selectThumbNail, selectAudioURI, selectTitle, selectAudioID, selectDownloadData, selectSoundStatus, selectAuthor, selectIsAudioOnly, selectIsRecently} from '../../../services/slices/navSlice';
import { Platform } from 'react-native';


export default function Player({navigation}) {
  const [playMusic, setPlayMusic] = useState(true);

  

  const Title = useSelector(selectTitle)
  const ThumbNail = useSelector(selectThumbNail)
  const audiouURI = useSelector(selectAudioURI)
  const audioID = useSelector(selectAudioID)
  const downloadData = useSelector(selectDownloadData)
  const status = useSelector(selectSoundStatus)
  const Artist = useSelector(selectAuthor)
  const isAudioOnly = useSelector(selectIsAudioOnly)
  const isRecently =  useSelector(selectIsRecently)

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




 
 

 

  //useEffect (() => {
    //return soundOBj
     // ? () => {
       // 
         // soundOBj.unloadAsync(); }
      //: undefined;
  //}, [soundOBj, audioID]);


  console.log(audioID)

  function handleNavigation(){
    if (isAudioOnly){
      navigation.navigate('MusicScreen', {thumbNail: ThumbNail,
        audioURI: audiouURI, 
        title: Title,
        downloadData: downloadData,
        audioID: audioID,
        artist: Artist
        })
    }
    else {
      navigation.navigate('VideoScreen', {videoThumbNail: ThumbNail,
        audioURI: audiouURI, 
        videoTitle: Title,
        downloadData: downloadData,
        videoId: audioID[1],
        rId: audioID[0],
        Search: false,
        isPlaylist: false,
        artist: Artist,
        isRecently: isRecently
        })
    }
  }


  
  

  return (
    <TouchableOpacity style={{marginBottom: Platform.OS == 'ios' ? 80 : 50}} onPress={handleNavigation}>
      <Container>
        <BarStatus>
          <Line progress={(status.durationMillis / status.positionMillis) * 100} />
        </BarStatus>
        <PhotoAlbum
          source={{
            uri: ThumbNail,
          }}
        />
        <Music>
          <Information>
            <InformationAlbum>
              <TitleMusic>{Title}</TitleMusic>
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
          <Controller onPress={() => setPlayMusic(!playMusic)}>
            {playMusic && (
              <MaterialCommunityIcons name="pause" size={30} color="#FFF" />
            )}
            {!playMusic && (
              <MaterialCommunityIcons name="play" size={30} color="#FFF" />
            )}
          </Controller>
        </Music>
      </Container>
    </TouchableOpacity>
  );
}
