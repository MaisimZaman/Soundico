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
import { selectThumbNail, selectAudioURI, selectTitle, selectAudioID, selectDownloadData, selectSoundStatus} from '../../../services/slices/navSlice';


export default function Player({Artist="Hanz Zimmer", navigation, soundOBj}) {
  const [playMusic, setPlayMusic] = useState(true);
  //const soundOBj = useSelector(selectSoundOBJ)
  

  const Title = useSelector(selectTitle)
  const ThumbNail = useSelector(selectThumbNail)
  const audiouURI = useSelector(selectAudioURI)
  const audioID = useSelector(selectAudioID)
  const downloadData = useSelector(selectDownloadData)
  const status = useSelector(selectSoundStatus)

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




 
 

  useEffect(() => {
    async function main(){
      if (playMusic){
        

    
        await soundOBj.playAsync(); 
      }
      else if (soundOBj != null && playMusic == false){
       soundOBj.pauseAsync()
    
      }

    }

    main()
    

  }, [playMusic, audioID, soundOBj])

  //useEffect (() => {
    //return soundOBj
     // ? () => {
       // 
         // soundOBj.unloadAsync(); }
      //: undefined;
  //}, [soundOBj, audioID]);


  
  

  return (
    <TouchableOpacity style={{marginBottom: 50}} onPress={() => navigation.navigate('MusicScreen', {thumbNail: ThumbNail,
      audioURI: audiouURI, 
      title: Title,
      downloadData: downloadData,
      audioID: audioID
      })}>
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
