import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Modal, Alert, Pressable, ImageBackground, Image, ScrollView, Linking, Platform} from 'react-native'
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
//import { styles } from './styles';
import { styles } from './styles';
import WebView from 'react-native-webview';

import { API_KEY } from '../Search/YoutubeApi';

import Axios from 'axios';
import TrackPlayer, {Capability, useProgress, Event, useTrackPlayerEvents, State} from 'react-native-track-player';
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
  selectDownloadData,
  setIsRecently
} from '../../../services/slices/navSlice';

import { useDispatch, useSelector } from 'react-redux';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';
import { AD_UNIT_ID } from './AddUnitKey';




export default function VideoDisplay(props) {

  
  
    const {width, height} = Dimensions.get("screen");
    const {
      rId, videoId, videoThumbNail, 
      videoTitle, Search, isPlaylist, isRecently,  
      artist, downloadData, plInfo, 
      playlistVideos, channelId,
      
    
    } = props.route.params;
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
    const [favorited, setFavourited] = useState(false)
    const [isPlaying, setIsPlaying] = useState()
    const iconPlay = !isPlaying ?   'pause-circle' : 'play-circle';
    const REVIEWER_ACCOUNT = "13WiiEF5wRRlKwpMEHx5hCFTlPq1"
    const [video, setVideo] = useState(useRef(null))
    const progress = useProgress()
    const timePast = msToTime(progress.position != 0 ? progress.position : 0);
    const timeLeft = msToTime(progress.position != 0 ? progress.duration - progress.position : 0);
    
    const dispatch = useDispatch()

    let index = 0;

    
  
    if (downloadData != "VideoLink"){
      index = downloadData.findIndex(object => {
          //return object.id === currentVideoID[0];
        
      });
    }


    //console.log(progress.position)
    //console.log(status.positionMillis)

    const diffrence = (progress.position * 1000)-status.positionMillis

    useEffect(() => {
      async function run(){
        
        const diffrence = (progress.position * 1000)-status.positionMillis
        if (video != null){
          if (video.current.positionMillis != progress.position*1000){
            //TrackPlayer.seekTo(video.current.positionMillis/1000)
            if ((progress.position * 1000) - diffrence > 0){
              await video.current.setPositionAsync(((progress.position * 1000) - diffrence))
              await video.current.playAsync()
            }
          
        }
        }
        
        
        
       // console.log(progress.position * 1000)
        //console.log(status.positionMillis)
        //console.log("diffrence")
        //console.log((progress.position * 1000)-status.positionMillis)
      }

      run()
    }, [])

    

    useEffect(() => {
      async function run(){
        if (isPlaying){
          await TrackPlayer.pause();
          await video.current.pauseAsync()
        } else {
          
          await  TrackPlayer.play();
          await video.current.playAsync()
          
        }

      }

      run()
      

    }, [isPlaying])

    useEffect(() => {
      async function fetchFunc(){
        var track = {

          url: playingVideo, // Load media from the network
          title: currentTitle,
          artist: currentArtist,
          artwork: currentThumbnail, // Load artwork from the network
          duration: progress.duration // Duration in seconds
        };
      

        const trackOBJ = await TrackPlayer.getQueue()
        if (trackOBJ!= null){
          if (trackOBJ[0].artwork != downloadData[0].artwork){
            TrackPlayer.reset()
            TrackPlayer.add(track)
          }
        }
        
               
       }
  
       //fetchFunc()
    },[downloadData])


    
    
    

   

    const setUpTrackPlayer = async () => {
      var track = {

        url: playingVideo, // Load media from the network
        title: currentTitle,
        artist: currentArtist,
        artwork: currentThumbnail, // Load artwork from the network
        duration: progress.duration // Duration in seconds
      };

      
  
   
      //}
      try {
          await TrackPlayer.setupPlayer();
          await TrackPlayer.add([track]);
            //await TrackPlayer.skip(index);
            //await TrackPlayer.getTrack(index)
            //console.log('Tracks added');
          TrackPlayer.play();        
        //await video.current.playAsync()
 
      } catch (e) {
        console.log(e);
      }
    };

    async function setup() {
      await TrackPlayer.setupPlayer({})
      //await TrackPlayer.skip(index);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
          Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      })
      //await TrackPlayer.add([track]);
      //TrackPlayer.play();
    }

    useEffect(() => { 
      setup()
      setUpTrackPlayer()
      
      
      return () => TrackPlayer.destroy()
    }, [playingVideo])

    

  

  useEffect(() => {
    if (progress.duration != undefined){
      if (progress.duration > 0){
        if (progress.position == progress.duration){
          
            skipFowardTrack(currentDownloadData, setNewSongData, currentVideoID, isRecently, isPlaylist)
          
          
        }
      }
    }

    
    
  }, [progress])


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
    dispatch(setIsRecently(isRecently))
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

          //console.log("audio formats under here")
          console.log(audioFormats)
          dispatch(setAudioURI(audioFormats[0].url))
          
      
          Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
         });

         
          //await video.current.playAsync()
        }

      
        main()
        //main()
        
    }, [currentVideoID, currentTitle, videoId, playingVideo])

   
    

 




    
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
                channelId: ''
            })

        } 
        
        
    },[])



    

    function renderVideoPlayer(){
      const REVIEWER_ACCOUNT = "13WiiEF5wRRlKwpMEHx5hCFTlPq1"
      if (auth.currentUser.uid == REVIEWER_ACCOUNT){
        return (
          <>

            <View style={{width:'100%',height:height/3,alignItems:'center'}}>
                <WebView
                style={{ marginTop: 20, width: 330, height: 230 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            
                allowsFullscreenVideo={true}
                source={{ uri: `https://www.youtube.com/embed/${currentVideoID[1]}`}}
        />
            </View>

        </>
        )
      }
      else if (playingVideo == null){
        return (
          <Image style={styles.video} source={{uri: currentThumbnail}}></Image>
        )
      }
        return (
          <>
            <Video
          ref={video}
          style={styles.video}
          shouldPlay={true}
          isMuted={true}
          source={{
            uri: playingVideo,
          }}
          //useNativeControls
          resizeMode="contain"
          //isLooping
      
          onPlaybackStatusUpdate={status => setStatus(status)}
        />
        
        </>
        )
    }

    function saveAudioData(audioURI){
     
      db.collection('audioDownloads')
          .doc(auth.currentUser.uid)
          .collection("userAudios")
          .add({
              audio: audioURI,
              thumbNail: currentThumbnail,
              title: currentTitle,
              creation: firebase.firestore.FieldValue.serverTimestamp(),
              channelTitle: artist,
              channelId: currentChannelId,
              new: true,
          })
      setDownloadProcessing(false)
  
        props.navigation.replace("MusicScreen", {
          thumbNail: currentThumbnail,
              audioURI: audioURI, 
              title: currentTitle,
              artist: currentArtist,
              new: true,
              downloadData: [{
                id: 1,
                url: audioURI, // Load media from the network
                title: currentTitle,
                artist: currentArtist,
                artwork: currentThumbnail, // Load artwork from the network
                duration: progress.duration// Duration in seconds
              }],
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




  async function handleNavigteToChannel(){
    console.warn(currentChannelId)
        
    const response = await Axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${currentChannelId}&part=snippet,id&order=date&maxResults=20`)
    const channelVideos = response.data

    props.navigation.replace("ChannelScreen", {title:currentArtist, photoAlbum:channelThumnail , playlistVideos: channelVideos.items, isCustom: false, searchedVideo: true })
  }


    async function togglePlayVideo(){

      setIsPlaying(!isPlaying)
    }

     return (
        <View style={gStyle.container}>
        <ImageBackground source={SECONDARY_BG}  style={styles.bgImage}>
        <ModalHeader
        video={true}
          left={<Feather  color={"white"} name="chevron-down" />}
          leftPress={() => {props.navigation.goBack(); dispatch(setAudioURI(null))}}
          right={ <Feather   onPress={() => props.navigation.navigate('MoreOptions', {
            albumTitle: currentTitle,
            albumCover: currentThumbnail,
            albumArtist: currentArtist,
            setDownloadProcessing: setDownloadProcessing,
            downloadProcessing: downloadProcessing,
            isPlaylist: isPlaylist,
            saveAudioData: saveAudioData,
            saveAudioPodCastData: saveAudioPodCastData,
            currentVideoID: currentVideoID,
            saveVideoData: saveVideoData,
            savePlaylistData: savePlaylistData,
            handleNavigteToChannel: handleNavigteToChannel,
            currentAudioURI: playingVideo
          })} color={"white"} name="more-horizontal" />}
          text={"Now Playing"}
          
        />
            <View style={gStyle.p3}>
            
            {renderVideoPlayer()}
          <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
            <View style={styles.containerSong}>
              <ScrollView horizontal={true}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                {currentTitle}
              </Text>
              </ScrollView>
              <TouchableOpacity onPress={handleNavigteToChannel}>
                  <Text  style={styles.artist}>{currentArtist}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.containerFavorite}>
              <TouchIcon
                icon={<FontAwesome color={colors.brandPrimary} name={favorited ? 'heart' : 'heart-o'} />}
                onPress={() => setFavourited(!favorited)}

                
              />
            </View> 
          </View>

          <View >
            <Slider
            
              minimumValue={0}
              maximumValue={progress.duration}
              value={progress.position}
              minimumTrackTintColor={colors.white}
              maximumTrackTintColor={colors.grey3}
              onSlidingComplete={(millis) =>  {TrackPlayer.seekTo(millis); status != 0 ? video.current.setPositionAsync((millis * 1000)) :   setCurrentPosition(millis)}}
              
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
                iconSize={40}
                disabled={index == 0}
                onPress={() => skipBackwardTrack(downloadData, setNewSongData, currentVideoID, isRecently, isPlaylist)}
              />
              <View style={gStyle.pH3}>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name={iconPlay} />}
                  iconSize={80}
                  onPress={togglePlayVideo}
                />
              </View>
              <TouchIcon
                icon={<FontAwesome color={colors.white} name="step-forward" />}
                iconSize={40}
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
        
             </ImageBackground>
      </View>
      
    );
    
  
    

    
    
}

