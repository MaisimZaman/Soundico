import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Modal, Alert, Pressable, ImageBackground, Image} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';
import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'

import { Audio, Video } from 'expo-av';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';

import ModalHeader from '../MusicPlayer/ModalHeader';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, device, func, gStyle } from '../MusicPlayer/constants/index';
import TouchIcon from '../MusicPlayer/TouchIcon';
import { msToTime,  skipBackwardTrack,  skipFowardTrack  } from './handlingfunctions';
import RenderModal from './downloadModal';
//import { styles } from './styles';
import { styles } from './styles';

import { API_KEY } from '../Search/YoutubeApi';

import Axios from 'axios';
// components
import { 
  setIsAudioOnly, 
  setAudioID, 
  setThumbNail, 
  setAuthor, 
  setTitle, 
  setSoundStatus, 
  setAudioURI, 
  setChannelId,
  selectThumbNail, 
  selectAudioID, 
  selectTitle,
  selectAudioURI,
  setDownloadData,
  selectAuthor,
  selectChannelId,
  selectDownloadData
} from '../../../services/slices/navSlice';

import { useDispatch, useSelector } from 'react-redux';



export default function VideoDisplay(props) {
    const {width, height} = Dimensions.get("screen");
    const [modalVisible, setModalVisible] = useState(false);
    const {rId, videoId, videoThumbNail, videoTitle, Search, isPlaylist, isRecently,  artist, downloadData, plInfo, playlistVideos, channelId} = props.route.params;
    const currentVideoID = useSelector(selectAudioID)
    const currentThumbnail = useSelector(selectThumbNail)
    const currentTitle = useSelector(selectTitle)
    const currentArtist = useSelector(selectAuthor)
    const currentChannelId = useSelector(selectChannelId)
    const currentDownloadData = useSelector(selectDownloadData)
    const [currentPosition, setCurrentPosition] = useState(0)
    const [status, setStatus] = useState(0);
    const [recentlyPlayed, setRecentlyPlayed] = useState([])
    const [downloadProcessing, setDownloadProcessing] = useState(false)
    const playingVideo  = useSelector(selectAudioURI);
    const [channelThumnail, setChannelThumbail] = useState('')
    //const [playingVideo, setPlayingVideo] = useState('null')
    const iconPlay = status.isPlaying ?   'pause-circle' : 'play-circle';
    
    const [video, setVideo] = useState(useRef(null))
    const timePast = msToTime(status != 0 ? status.positionMillis : 0);
    const timeLeft = msToTime(status != 0 ? status.durationMillis - status.positionMillis : 0);

    const dispatch = useDispatch()

    const index = downloadData.findIndex(object => {
      return object.id === currentVideoID[0];
    });




    

  useEffect(() => {
    dispatch(setAudioURI(null))
    //setCurrentPosition(0)
    //,setStatus(0)
    dispatch(setIsAudioOnly(false))
    dispatch(setAudioID([rId, videoId]))
    dispatch(setThumbNail(videoThumbNail))
    dispatch(setAuthor(artist))
    dispatch(setTitle(videoTitle))
    dispatch(setSoundStatus(0))
    dispatch(setIsAudioOnly(false))
    dispatch(setDownloadData(downloadData))
    dispatch(setChannelId(channelId))
    
  }, [])


    useEffect(() => {
      Axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${currentChannelId}&key=${API_KEY}`)
      .then(res => {
        const channelThumnail = res.data.items[0].snippet.thumbnails.high.url;
   
        setChannelThumbail(channelThumnail)
        
      })
    }, [currentVideoID, currentTitle, videoId])

    useEffect(() => {
      

        async function main(){
          setCurrentPosition(0)
          setStatus(0)
          let info = await ytdl.getInfo(currentVideoID[1]);
          let audioFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
          //setPlayingVideo(audioFormats[0].url);
         
          dispatch(setAudioURI(audioFormats[0].url))
          await video.current.playAsync()
        }

        main()
        //main()
        
    }, [currentVideoID, currentTitle, videoId])

   
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
    }, [])

    
    useEffect( () => {
        if (Search){
            db.collection('recentlyPlayed')
            .doc(auth.currentUser.uid)
            .collection("userRecents")
            .add({
                videoId: videoId,
                videoThumbNail: videoThumbNail,
                videoTitle: videoTitle,
                videoArtist: artist,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                channelId: currentChannelId
            })

        }
        
        
    },[])


    function renderVideoPlayer(){
      if (playingVideo == null){
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

    function saveAudioData(downloadURL){
     
      db.collection('audioDownloads')
          .doc(auth.currentUser.uid)
          .collection("userAudios")
          .add({
              audio: downloadURL,
              thumbNail: currentThumbnail,
              title: currentTitle,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              channelTitle: artist,
              channelId: currentChannelId
          })
      setDownloadProcessing(false)
  
        props.navigation.replace("MusicScreen", {thumbNail: currentThumbnail,
              audioURI: downloadURL, 
              title: currentTitle,
              downloadData: downloadURL,
                          audioID: '2121'
                              })
  
  }
  
   function saveAudioPodCastData(downloadURL){
      //console.log("this is running correctly")
      db.collection('podcastDownloads')
          .doc(auth.currentUser.uid)
          .collection("userPodcasts")
          .add({
              audio: downloadURL,
              thumbNail: currentThumbnail,
              title: currentTitle,
              channelTitle: artist
          })
      setDownloadProcessing(false)
  
  }
  
   function saveVideoData(downloadURL){
      db.collection('videoDownloads')
          .doc(auth.currentUser.uid)
          .collection("userVideos")
          .add({
              videoURI: downloadURL,
              thumbNail: currentThumbnail,
              title: currentTitle,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              channelTitle: artist
          })
        setDownloadProcessing(false)
  
  }
  
   function savePlaylistData(){
      db.collection('playlists')
          .doc(auth.currentUser.uid)
          .collection("userPlaylists")
          .add({
  
              playlistTitle: plInfo[0],
              playListThumbnail: plInfo[1],
              playlistVideos: playlistVideos,
  
              
          })
  
  }
  
  

    function setNewSongData(thumbNail, audioURI, title,audioID, artist){
      dispatch(setThumbNail(thumbNail))
      dispatch(setAudioURI(audioURI))
      dispatch(setAudioID(audioID))
      dispatch(setTitle(title))
      dispatch(setIsAudioOnly(false))
      dispatch(setAuthor(artist))
      
  }



  async function handleNavigteToChannel(item){
    
        
    const response = await Axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${currentChannelId}&part=snippet,id&order=date&maxResults=20`)
    const channelVideos = response.data

    props.navigation.replace("ChannelScreen", {title:currentArtist, photoAlbum:channelThumnail , playlistVideos: channelVideos.items, isCustom: false, searchedVideo: true })
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
        <ImageBackground source={BG_IMAGE}  style={styles.bgImage}>
        <ModalHeader
          left={<Feather color={colors.greyLight} name="chevron-down" />}
          leftPress={() => {props.navigation.goBack(); dispatch(setAudioURI(null))}}
          right={ <Feather onPress={() => setModalVisible(true)} color={colors.greyLight} name="more-horizontal" />}
          text={"Now Playing"}
          
        />


            <View style={gStyle.p3}>
            
            {renderVideoPlayer()}
          <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
            <View style={styles.containerSong}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                {currentTitle}
              </Text>
              <TouchableOpacity onPress={handleNavigteToChannel}>
                  <Text  style={styles.artist}>{currentArtist}</Text>
              </TouchableOpacity>
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
                iconSize={45}
                disabled={index == 0}
                onPress={() => skipBackwardTrack(downloadData, setNewSongData, currentVideoID, isRecently, isPlaylist)}
              />
              <View style={gStyle.pH3}>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name={iconPlay} />}
                  iconSize={85}
                  onPress={togglePlayVideo}
                />
              </View>
              <TouchIcon
                icon={<FontAwesome color={colors.white} name="step-forward" />}
                iconSize={45}
                disabled={index == downloadData.length-1}
                onPress={() => skipFowardTrack(downloadData,setNewSongData, currentVideoID, isRecently, isPlaylist)}
              />
             
            </View>
            <TouchIcon
              icon={<Feather color={colors.greyLight} name="repeat" />}
              onPress={() => video.current.setPositionAsync(0)}
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
        
             <RenderModal setDownloadProcessing={setDownloadProcessing} downloadProcessing={downloadProcessing}  modalVisible={modalVisible}  setModalVisible={setModalVisible} isPlaylist={isPlaylist} saveAudioData={saveAudioData} saveAudioPodCastData={saveAudioPodCastData} currentVideoID={currentVideoID[1]} saveVideoData={saveVideoData} savePlaylistData={savePlaylistData} ></RenderModal>
             </ImageBackground>
      </View>
      
    );
    
  
    

    
    
}

