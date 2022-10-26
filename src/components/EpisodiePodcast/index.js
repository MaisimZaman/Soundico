import React, {useEffect, useState} from 'react';

import { AntDesign } from '@expo/vector-icons';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { Audio } from 'expo-av';

import {
  Container,
  Episodie,
  AreaPhotoEpisodie,
  Image,
  InformationEpisodie,
  TitlePodcast,
  AuthorPodcast,
  ActionsArea,
  DescriptionTime,
} from './styles';

export default function EpisodiePodcast({
  photo,
  name,
  ChanelPodcast,
  informations,
  AudioURI
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [sound, setSound] = useState(null)

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
    async function run(){
      const { sound } = await Audio.Sound.createAsync({uri: AudioURI});
      setSound(sound)

    }
    run()

    
  }, [])

  useEffect(() => {
    async function main(){
      if (isPlaying){
        

        console.log('Playing Sound');
         await sound.playAsync(); 
      }
      else if (sound != null && isPlaying == false){
       sound.pauseAsync()
    
      }

    }

    main()

  }, [isPlaying])

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <Container>
      <Episodie>
        <AreaPhotoEpisodie>
          <Image source={{ uri: photo }} />
        </AreaPhotoEpisodie>
        <InformationEpisodie>
          <TitlePodcast>{name}</TitlePodcast>
          <AuthorPodcast>{ChanelPodcast}</AuthorPodcast>
        </InformationEpisodie>
      </Episodie>
      <ActionsArea>
        <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
          <AntDesign name={isPlaying? "pause" : "play"} size={30} color="#fff" />
        </TouchableOpacity>
        <DescriptionTime>{informations}</DescriptionTime>
        <AntDesign name="check" size={24} color="#fff" />
        <AntDesign name="download" size={24} color="#fff" />
      </ActionsArea>
    </Container>
  );
}
