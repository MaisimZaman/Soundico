import * as React from 'react';
import { useEffect, useState} from 'react';
import { Audio } from 'expo-av';
import { Image, StyleSheet, Text, View, ImageBackground, ScrollView, Platform } from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import { colors, device, func, gStyle } from './constants/index';
// components
import ModalHeader from './ModalHeader';
import TouchIcon from './TouchIcon';
import { useDispatch } from 'react-redux';
import { setThumbNail,  setAudioURI, setTitle, setAudioID, setDownloadData,  setSoundStatus, setIsAudioOnly, setAuthor, selectAuthor, selectPaused, setPaused, setPlaylistName} from '../../../services/slices/navSlice';
import { useSelector } from 'react-redux';
import { selectThumbNail, selectAudioURI, selectTitle, selectAudioID,  selectSoundStatus, selectDownloadData} from '../../../services/slices/navSlice';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';
import ytdl from 'react-native-ytdl';

//import TrackPlayer from 'react-native-track-player';

import { convertTime, pauseIcon, playIcon } from './helpers';
import { auth, db } from '../../../services/firebase';
import * as FileSystem from 'expo-file-system';

//import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';



import TrackPlayer, {Capability, useProgress, Event, useTrackPlayerEvents, State} from 'react-native-track-player';
//import MusicControl from 'react-native-music-control';





export default function MusicPlayer(props){
  
  const dispatch = useDispatch();

  const defaultThumbnail = 'https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg'

  const {thumbNail, audioURI, title,audioID, downloadData, playListName, notCustom, artist, isDdownload, playlistId} = props.route.params
  
  const currentThumbNail = useSelector(selectThumbNail)
  const currentAudioURI = useSelector(selectAudioURI)
  const currentTitle = useSelector(selectTitle)
  const currentAudioID = useSelector(selectAudioID)
  const currentArtist = useSelector(selectAuthor)
  const currentDownloadData = useSelector(selectDownloadData)
  const progress = useProgress()


    const { navigation } = props;
    const [favorited, setFavourited] = useState(false)
    const paused = useSelector(selectPaused)
    //const sound = useSelector(selectSoundOBJ)
    const [sound, setSound] = useState(null)
    const [repeat, setRepeat] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(0)
    const [state, setState] = useState(null)
    
    
    

    const favoriteColor = favorited ? colors.brandPrimary : colors.white;
    const favoriteIcon = favorited ? 'heart' : 'heart-o';
    const iconPlay = paused? playIcon : pauseIcon;



  
    function msToTime(duration) {
      var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;

     
      var ret = "";

      if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    }

    const timePast = msToTime(progress.position != 0 ? progress.position : 0);
    const timeLeft = msToTime(progress.position != 0 ? progress.duration - progress.position : 0);

    useEffect(() => {
      async function fetchFunc(){
      


        const trackOBJ = await TrackPlayer.getQueue()
        //console.log(trackOBJ)
        //setTrackObject(trackOBJ)
  
  
        if (trackOBJ[0].artwork != downloadData[0].artwork){
          TrackPlayer.reset()
          TrackPlayer.add(downloadData)
        }
       
           
       }
  
       fetchFunc()
    },[downloadData])
    

  

    useEffect(() => {
      async function checkIsPlaying(){
        const state = await TrackPlayer.getState();
        

       
        setState(state)
      }

      checkIsPlaying()
    })
      

      console.log(paused)

      useEffect(() => {
        dispatch(setPlaylistName(playListName))
        if (state != null){
          if (state == State.Playing && paused == true){
           
            dispatch(setPaused(false))
          } else if (state == State.Paused && paused == false){
            dispatch(setPaused(true))
          }
        }
        
      }, [state])
   
   



    const setUpTrackPlayer = async () => {
      const index = downloadData.findIndex(object => {
        return object.id === audioID;
      });
      
      try {
        console.log("This ran")
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add(downloadData);
        await TrackPlayer.skip(index);
        //await TrackPlayer.getTrack(index)
        //console.log('Tracks added');
        if (paused != true){
          TrackPlayer.play();
        }
        

        
        
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
      
    }

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


  
    useEffect(() => { 
      setup()
      setUpTrackPlayer()
      //setUpTrackPlayer()
      //return () => TrackPlayer.destroy()
    }, [currentDownloadData])
  

    useEffect(() => {
      async function run(){
      if (progress.duration != undefined){
        if (progress.duration > 0){
          if (progress.position == progress.duration){
            
            await TrackPlayer.skipToNext();
            
            
          }
        }
      }
    }

    run()
      
    }, [progress])

   



    useEffect(() => {
      
        
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
        
     });

    
     
     setNewSongData(thumbNail, audioURI, title,audioID, artist)
    dispatch(setDownloadData(downloadData))
    
    }, [])

    

    useEffect(() => {
      async function main(){
        
        if (paused == false){
  
          await  TrackPlayer.play();
        }
        else if (paused == true){
         await TrackPlayer.pause();
      
        }

      }

      main()
      

    }, [paused, currentAudioID, sound, currentPosition])


    function setNewSongData(thumbNail, audioURI, title,audioID, artist){
          dispatch(setThumbNail(thumbNail))
          dispatch(setAudioURI(audioURI))
          dispatch(setAudioID(audioID))
          dispatch(setTitle(title))
          dispatch(setIsAudioOnly(true))
          dispatch(setAuthor(artist))
         
    }
    
    function toggleFavorite() {

        setFavourited((prev) => (!prev.favorited))
    }

    function togglePlay() {
        dispatch(setPaused(!paused))

    }


    

  

    
    function shuffleTrack(){
      if (isDdownload){
        const randomTrack = Math.floor(Math.random() * downloadData.length);
        const  randomThumbNail = defaultThumbnail
        const randomAudioURI = downloadData[randomTrack].uri
        const randomTitle = downloadData[randomTrack].filename.slice(0, -4)
        const randomID = downloadData[randomTrack].id
        const randomArtist = "Unknown"
        setNewSongData(randomThumbNail, randomAudioURI, randomTitle, randomID, randomArtist)
        dispatch(setPaused(false))

      } else {
        const randomTrack = Math.floor(Math.random() * downloadData.length);
        const  randomThumbNail = downloadData[randomTrack].data.thumbNail                                                                                  
        const randomAudioURI = downloadData[randomTrack].data.audio
        const randomTitle = downloadData[randomTrack].data.title
        const randomID = downloadData[randomTrack].id
        const randomArtist = downloadData[randomTrack].data.channelTitle
        setNewSongData(randomThumbNail, randomAudioURI, randomTitle, randomID, randomArtist)
        dispatch(setPaused(false))
      }
        
    }

    function addMusicToPlaylist(){
      navigation.navigate('AddToMadePlaylist', {playListObject: {id: currentAudioID, data: {
        audio: currentAudioURI,
        channelId: currentAudioID,
        thumbNail: currentThumbNail,
        channelTitle: currentArtist ,
        title: currentTitle,
      },
  
        url:currentAudioURI, // Load media from the network
        title: currentTitle,
        artist: currentArtist,
        artwork: currentThumbNail, // Load artwork from the network
        duration: 10000// Duration in seconds 
    
    }})
    }

    function removeFromPlaylist(){
      const index = downloadData.findIndex(object => {
        return object.id === currentAudioID;
      });

      
      var copyDownloadData = [...downloadData]

      copyDownloadData.splice(index, 1)


      db.collection('playlists')
            .doc(auth.currentUser.uid)
            .collection("userPlaylists")
            .doc(playlistId)
            .update({
                playlistVideos: copyDownloadData

            })

      navigation.replace('Main')
    }

    function deleteMusicItem(){
      db.collection('audioDownloads')
      .doc(auth.currentUser.uid)
      .collection('userAudios')
      .doc(currentAudioID)
      .delete()

      navigation.goBack()
    }

    

  
  

    return (
      
        <View style={gStyle.container}>
          <ImageBackground style={styles.bgImage} resizeMode='cover' source={SECONDARY_BG}>
          <ModalHeader
            left={<Feather color={colors.greyLight} name="chevron-down" />}
            leftPress={() => {navigation.goBack()}}
            right={ <Feather onPress={() => navigation.navigate('SavedMoreOptions', {albumTitle: currentTitle, 
              albumCover: currentThumbNail, 
              albumArtist: currentArtist, 
              deleteMusicItem: deleteMusicItem, 
              currentAudioURI: currentAudioURI,
              addMusicToPlaylist: addMusicToPlaylist,
              playListName: playListName,
              removeFromPlaylist: removeFromPlaylist
            
            })} color={colors.greyLight} name="more-horizontal" />}
            text={playListName != undefined ? playListName  : "Saved"}
          />
  
          <View style={gStyle.p3}>
            <View style={styles.ContainerImage}>
            <Image  source={{uri: currentThumbNail}} style={styles.image} />
            </View>
  
            <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
              <View style={styles.containerSong}>
                <ScrollView horizontal={true}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                  {currentTitle}
                </Text>
                </ScrollView>
                <Text style={styles.artist}>{currentArtist}</Text>
              </View>
              <View style={styles.containerFavorite}>
                <TouchIcon
                  icon={<FontAwesome color={favoriteColor} name={favoriteIcon} />}
                  onPress={toggleFavorite}
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
                onSlidingComplete={(millis) => TrackPlayer.seekTo(millis)}
                
                
                
                
              />
              <View style={styles.containerTime}>
                <Text style={styles.time}>{timePast}</Text>
                <Text style={styles.time}>{`-${timeLeft}`}</Text>
              </View>
            </View>
  
            <View style={styles.containerControls}>
              <TouchIcon
                icon={<Feather color={colors.greyLight} name="shuffle" />}
                onPress={shuffleTrack}
              />
              <View style={gStyle.flexRowCenterAlign}>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name="step-backward" />}
                  iconSize={50}
                  //disabled={chceckDisabled(false)}
                  onPress={async () => await TrackPlayer.skipToPrevious()}
                />
                <View style={gStyle.pH3}>
                  <TouchIcon
                    icon={<Image style={{width:90, height: 90}} source={{uri: iconPlay}}/>}
                    iconSize={80}
                    onPress={togglePlay}
                  />
                </View>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name="step-forward" />}
                  iconSize={50}
                  //disabled={chceckDisabled(true)}
                  onPress={async ()  => await TrackPlayer.skipToNext()}
                />
               
              </View>
              <TouchIcon
                icon={<Feather color={colors.greyLight} name="repeat" />}
                onPress={() => {setRepeat(!repeat); setCurrentPosition(0)}}
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
                onPress={addMusicToPlaylist}
              />
            </View>
          </View>
         
        
          </ImageBackground>
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
    width: device.width - 48,
    borderRadius: 12
  },
  containerDetails: {
    marginBottom: 16
  },
  containerSong: {
    flex: 6
  },
  song: {
    ...gStyle.textSpotifyBold24,
    color: colors.white,
    fontWeight: 'bold'
  },
  artist: {
    ...gStyle.textSpotify18,
    color: colors.greyInactive,
    fontWeight: 'bold'
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
  },
  bgImage: {
    flex: 1,
    justifyContent: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1b1c1f',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  button1: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 20
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 20
  },
  button3: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button4: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 20
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#054c85',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: "white",
    fontSize: 25
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  ContainerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 1.8,
    shadowRadius: 12,
    zIndex: device.web ? 20 : 0
  },
});