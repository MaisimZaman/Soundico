import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Modal, Alert, Pressable, ImageBackground, Image} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';
import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'

import { Audio, Video } from 'expo-av';
import { BG_IMAGE } from '../../services/backgroundImage';

import ModalHeader from '../MusicPlayer/ModalHeader';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, device, func, gStyle } from '../MusicPlayer/constants/index';
import TouchIcon from '../MusicPlayer/TouchIcon';
import { msToTime, downloadAudioOrVideo  } from './handlingfunctions';
import RenderModal from './downloadModal';
//import { styles } from './styles';
import { styles } from './styles';
// components


export default function VideoDisplay(props) {
    const {width, height} = Dimensions.get("screen");
    const [modalVisible, setModalVisible] = useState(false);
    const {videoId, videoThumbNail, videoTitle, Search, isPlaylist, playlistVideos, artist='unknown', plInfo} = props.route.params;
    const [currentVideoID, setCurrentVideoID] = useState(videoId)
    const [currentThumbnail, setCurrentThumbnail]= useState(videoThumbNail)
    const [currentTitle, setCurrentTitle] = useState(videoTitle)
    const [currentPosition, setCurrentPosition] = useState(0)
    const [status, setStatus] = useState(0);
    const [recentlyPlayed, setRecentlyPlayed] = useState([])
    const [playingVideo, setPlayingVideo] = useState('null');
    const iconPlay = status.isPlaying ?   'pause-circle' : 'play-circle';
    
    const [video, setVideo] = useState(useRef(null))
    const timePast = msToTime(status != 0 ? status.positionMillis : 0);
    const timeLeft = msToTime(status != 0 ? status.durationMillis - status.positionMillis : 0);

    useEffect(() => {
     
        async function main(){
          let info = await ytdl.getInfo(currentVideoID);
          let audioFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
          setPlayingVideo(audioFormats[0].url);
        }

        main()
        
    }, [videoId])

   
    useEffect(() => {

      async function runAudio(){
        if (video){
          await video.current.playAsync()
        }
      
    }

    runAudio()

  }, [currentVideoID, currentPosition, video])


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
    }, [currentVideoID])

    
    useEffect( () => {
        if (Search){
            db.collection('recentlyPlayed')
            .doc(auth.currentUser.uid)
            .collection("userRecents")
            .add({
                videoId: currentVideoID,
                videoThumbNail: currentThumbnail,
                videoTitle: currentTitle,
                videoArtist: artist,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })

        }
        
        
    },[])

    function renderVideoPlayer(){
      if (playingVideo == 'null'){
        return (
          <Image style={styles.video} source={{uri: currentThumbnail}}></Image>
        )
      }
        return (
            <Video
          ref={video}
          style={styles.video}
          source={{
            uri: playingVideo,
          }}
          //useNativeControls
          resizeMode="contain"
          isLooping
      
          onPlaybackStatusUpdate={status => setStatus(status)}
        />
        )
    }


    async function togglePlayVideo(){

      if (status.isPlaying){
        await video.current.pauseAsync()
      }
      else {
        await video.current.playAsync()
      }
    }

     return (
        <View style={gStyle.container}>
        <ImageBackground style={styles.bgImage} resizeMode='cover' source={{uri: BG_IMAGE}}>
        <ModalHeader
          left={<Feather color={colors.greyLight} name="chevron-down" />}
          leftPress={() => props.navigation.goBack()}
          right={ <Feather onPress={() => setModalVisible(true)} color={colors.greyLight} name="more-horizontal" />}
          text={"Preview"}
        />


            <View style={gStyle.p3}>
            
            {renderVideoPlayer()}
          <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
            <View style={styles.containerSong}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                {videoTitle}
              </Text>
              <Text style={styles.artist}>{artist}</Text>
            </View>
            <View style={styles.containerFavorite}>
              <TouchIcon
                icon={<FontAwesome color={colors.brandPrimary} name={'heart'} />}
                onPress={() => null}
              />
            </View>
          </View>

          <View >
            <Slider
              minimumValue={0}
              maximumValue={status.durationMillis}
              value={status.positionMillis}
              minimumTrackTintColor={colors.white}
              maximumTrackTintColor={colors.grey3}
              onSlidingComplete={ (millis) =>  {video.current.setPositionAsync(millis); setCurrentPosition(millis)}}
              
              
              
              
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
                onPress={() => null}
              />
              <View style={gStyle.pH3}>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name={iconPlay} />}
                  iconSize={64}
                  onPress={togglePlayVideo}
                />
              </View>
              <TouchIcon
                icon={<FontAwesome color={colors.white} name="step-forward" />}
                iconSize={32}
                onPress={() => null}
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
        
             <RenderModal modalVisible={modalVisible} setModalVisible={setModalVisible} isPlaylist={isPlaylist}></RenderModal>
        </ImageBackground>
      </View>
      
    );
    
  
    

    
    
}

