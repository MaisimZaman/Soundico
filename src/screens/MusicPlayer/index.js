import * as React from 'react';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import { colors, device, func, gStyle } from './constants/index';
// components
import ModalHeader from './ModalHeader';
import TouchIcon from './TouchIcon';
import { TouchableOpacity } from 'react-native-gesture-handler';




export default function MusicPlayer(props){

  const {thumbNail, audioURI, title,audioID, downloadData} = props.route.params

  const [currentThumbNail, setCurrentThumbNail] = useState(thumbNail);
  const [currentAudioURI, setCurrentAudioURI] = useState(audioURI);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentAudioID, setCurrentAudioID] = useState(audioID);

    const screenProps = {
      length: 20,
      album: "Intersteller Alubum",
      image: "https://m.media-amazon.com/images/I/71otC8duVIL._SL1367_.jpg",
      audioURI: "https://firebasestorage.googleapis.com/v0/b/music-app-51eec.appspot.com/o/audioDownloads%2F8GBeLfePnWMuIWa2wtXDfsNiblm2%2F0.71tclh3shq?alt=media&token=965f8451-8715-4588-87df-cb5be296c317",
      title: "Dreaming of the crash",
      artist: "Hanz zimmer"
    }

    const { navigation } = props;
    const  currentSongData  = screenProps;
    const [favorited, setFavourited] = useState(false)
    const [paused, setPaused] = useState(false)
    const [sound, setSound] = useState(null)
    

    const favoriteColor = favorited ? colors.brandPrimary : colors.white;
    const favoriteIcon = favorited ? 'heart' : 'heart-o';
    const iconPlay = paused ? 'play-circle' : 'pause-circle';

    const timePast = func.formatTime(0);
    const timeLeft = func.formatTime(20);

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
        if (paused == false){
          console.log('Loading Sound');
          const { sound } =  await Audio.Sound.createAsync({uri: currentAudioURI});
          setSound(sound);
  
          console.log('Playing Sound');
           await sound.playAsync(); 
        }
        else if (sound != null && paused == true){
         sound.pauseAsync()
      
        }

      }

      main()
      

    }, [paused, currentAudioID])

    useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync(); }
        : undefined;
    }, [sound, currentAudioID]);
    
    function toggleFavorite() {

        setFavourited((prev) => (!prev.favorited))
    }

    function togglePlay() {
        setPaused(!paused)

    }

    function skipFowardTrack(){
      const index = downloadData.findIndex(object => {
        return object.id === currentAudioID;
      });

      if (index < downloadData.length){
        const forwardThumbNail = downloadData[index + 1].data.thumbNail
        setCurrentThumbNail(forwardThumbNail)
        const forwardAudioURI = downloadData[index + 1].data.audio
        setCurrentAudioURI(forwardAudioURI)
        const forwardTitle = downloadData[index + 1].data.title
        setCurrentTitle(forwardTitle)
        const forwardID = downloadData[index + 1].id
        setCurrentAudioID(forwardID)
        setPaused(false)

      }
    }

    function skipBackwardTrack(){
      const index = downloadData.findIndex(object => {
        return object.id === currentAudioID;
      });

      if (index > 0){
        const forwardThumbNail = downloadData[index - 1].data.thumbNail
        setCurrentThumbNail(forwardThumbNail)
        const forwardAudioURI = downloadData[index - 1].data.audio
        setCurrentAudioURI(forwardAudioURI)
        const forwardTitle = downloadData[index - 1].data.title
        setCurrentTitle(forwardTitle)
        const forwardID = downloadData[index - 1].id
        setCurrentAudioID(forwardID)
        setPaused(false)

      }
    }

    

    return (
        <View style={gStyle.container}>
          <ModalHeader
            left={<Feather color={colors.greyLight} name="chevron-down" />}
            leftPress={() => navigation.goBack(null)}
            right={<Feather color={colors.greyLight} name="more-horizontal" />}
            text={currentSongData.album}
          />
  
          <View style={gStyle.p3}>
            <Image source={{uri: currentThumbNail}} style={styles.image} />
  
            <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
              <View style={styles.containerSong}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                  {currentTitle}
                </Text>
                <Text style={styles.artist}>{currentSongData.artist}</Text>
              </View>
              <View style={styles.containerFavorite}>
                <TouchIcon
                  icon={<FontAwesome color={favoriteColor} name={favoriteIcon} />}
                  onPress={toggleFavorite}
                />
              </View>
            </View>
  
            <View style={styles.containerVolume}>
              <Slider
                minimumValue={0}
                maximumValue={currentSongData.length}
                minimumTrackTintColor={colors.white}
                maximumTrackTintColor={colors.grey3}
              />
              <View style={styles.containerTime}>
                <Text style={styles.time}>{timePast}</Text>
                <Text style={styles.time}>{`-${timeLeft}`}</Text>
              </View>
            </View>
  
            <View style={styles.containerControls}>
              <TouchIcon
                icon={<Feather color={colors.greyLight} name="shuffle" />}
                onPress={() => null}
              />
              <View style={gStyle.flexRowCenterAlign}>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name="step-backward" />}
                  iconSize={32}
                  onPress={skipBackwardTrack}
                />
                <View style={gStyle.pH3}>
                  <TouchIcon
                    icon={<FontAwesome color={colors.white} name={iconPlay} />}
                    iconSize={64}
                    onPress={togglePlay}
                  />
                </View>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name="step-forward" />}
                  iconSize={32}
                  onPress={skipFowardTrack}
                />
               
              </View>
              <TouchIcon
                icon={<Feather color={colors.greyLight} name="repeat" />}
                onPress={() => null}
              />
            </View>
  
            <View style={styles.containerBottom}>
              <TouchIcon
                icon={<Feather color={colors.greyLight} name="speaker" />}
                onPress={() => null}
              />
              <TouchIcon
                icon={
                  <MaterialIcons color={colors.greyLight} name="playlist-play" />
                }
                onPress={() => null}
              />
            </View>
          </View>
        </View>
      );
    
}




MusicPlayer.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  screenProps: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  image: {
    height: device.width - 48,
    marginVertical: device.iPhoneNotch ? 36 : 8,
    width: device.width - 48
  },
  containerDetails: {
    marginBottom: 16
  },
  containerSong: {
    flex: 6
  },
  song: {
    ...gStyle.textSpotifyBold24,
    color: colors.white
  },
  artist: {
    ...gStyle.textSpotify18,
    color: colors.greyInactive
  },
  containerFavorite: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'center'
  },
  containerTime: {
    ...gStyle.flexRowSpace
  },
  time: {
    ...gStyle.textSpotify10,
    color: colors.greyInactive
  },
  containerControls: {
    ...gStyle.flexRowSpace,
    marginTop: device.iPhoneNotch ? 24 : 8
  },
  containerBottom: {
    ...gStyle.flexRowSpace,
    marginTop: device.iPhoneNotch ? 32 : 8
  }
});