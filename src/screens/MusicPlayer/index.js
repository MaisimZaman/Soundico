import * as React from 'react';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

import { Image, StyleSheet, Text, View, ImageBackground, Modal, Pressable, PermissionsAndroid, Platform, Alert } from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import { colors, device, func, gStyle } from './constants/index';
// components
import ModalHeader from './ModalHeader';
import TouchIcon from './TouchIcon';
import { useDispatch } from 'react-redux';
import { setThumbNail,  setAudioURI, setTitle, setAudioID, setDownloadData, setSoundOBJ, setSoundStatus, setIsAudioOnly, setAuthor, selectAuthor} from '../../../services/slices/navSlice';
import { useSelector } from 'react-redux';
import { selectThumbNail, selectAudioURI, selectTitle, selectAudioID, selectSoundOBJ, selectSoundStatus} from '../../../services/slices/navSlice';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';
import ytdl from 'react-native-ytdl';
import { convertTime } from './helpers';
import { auth, db } from '../../../services/firebase';
import * as FileSystem from 'expo-file-system';

//import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';


//import TrackPlayer from 'react-native-track-player';
//import MusicControl from 'react-native-music-control';




export default function MusicPlayer(props){

  const dispatch = useDispatch();

  const defaultThumbnail = 'https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg'

  const {thumbNail, audioURI, title,audioID, downloadData, playListName, notCustom, artist, isDdownload} = props.route.params

  const [playListAudioURI, setPlayListAudioURI] = useState(audioURI)
  
  const [modalVisible, setModalVisible] = useState(false)

  
  const status = useSelector(selectSoundStatus)
  const currentThumbNail = useSelector(selectThumbNail)
  const currentAudioURI = useSelector(selectAudioURI)
  const currentTitle = useSelector(selectTitle)
  const currentAudioID = useSelector(selectAudioID)
  const currentArtist = useSelector(selectAuthor)

  const [progress, setProgress] = useState(0);

  


  

  async function downloadSongToDevice(){

    function replaceIllegalChars(string){
      return string.replace('#','')
      .replace('|', '')
      .replace('%', '')
      .replace('$', '')
    }

    const uri = "http://techslides.com/demos/sample-videos/small.mp4"
      let fileUri = FileSystem.documentDirectory + `${replaceIllegalChars(currentTitle)}.mp3`;
      FileSystem.downloadAsync(currentAudioURI, fileUri)
      .then(({ uri }) => {
        
          saveFile(uri);
          console.log(uri)
         
        })
        .catch(error => {
          console.error(error);
        })
        //Alert.alert(`${currentTitle} downloaded onto device`)
        //Alert(`${currentTitle} downloaded onto device`)

    
      
  
    async function saveFile(fileUri){
      console.warn(fileUri)
      const checkAndroidPermission = async () => {
        try {
          const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
          await PermissionsAndroid.request(permission);
          console.warn("This ran")
          Promise.resolve();
        } catch (error) {
          Promise.reject(error);
        }
      };
      await checkAndroidPermission();
      
        const { status }  = await MediaLibrary.requestPermissionsAsync();

        
        
        if (status === "granted") {
          const asset = await MediaLibrary.createAssetAsync(fileUri)
          await MediaLibrary.createAlbumAsync("SoundicoDownloads", asset, false)
        }
        
    }
    
  
    
  } 
    const { navigation } = props;
    const [favorited, setFavourited] = useState(false)
    const [paused, setPaused] = useState(false)
    const sound = useSelector(selectSoundOBJ)
    //const [sound, setSound] = useState(null)
    const [repeat, setRepeat] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(0)
    
    

    const favoriteColor = favorited ? colors.brandPrimary : colors.white;
    const favoriteIcon = favorited ? 'heart' : 'heart-o';
    const iconPlay = paused ? 'play-circle' : 'pause-circle';

    function msToTime(s) {
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;

     
    
      if (secs < 10){
        return  mins + ':' + "0" + secs;
      }
      return  mins + ':' + secs;
    }

    const timePast = msToTime(status != 0 ? status.positionMillis : 0);
    const timeLeft = msToTime(status != 0 ? status.durationMillis - status.positionMillis : 0);
  
  
  
  
  
    useEffect(() => {
      if (status.durationMillis != undefined){
        if (status.durationMillis > 0){
          if (status.positionMillis == status.durationMillis){
            skipFowardTrack()
          }
        }
      }
      
    }, [status])


  



    useEffect(() => {   
      async function run(){
        setCurrentPosition(0)
        
        
        const { sound } = await Audio.Sound.createAsync({uri: currentAudioURI}, { shouldPlay: true }, (status) => dispatch(setSoundStatus(status)));

            
            //setSound(sound)
          dispatch(setSoundOBJ(sound))



          
            //console.warn(status.durationMillis)

          //await TrackPlayer.setupPlayer();
    
        // Add a track to the queue

      }
      
  
      run()

    

      
    }, [currentAudioID, repeat])



    

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
          
  
  
           //await sound.playAsync();
           
          
          await sound.playFromPositionAsync(currentPosition)
        }
        else if (sound != null && paused == true){
         await sound.pauseAsync()
      
        }

      }

      main()
      

    }, [paused, currentAudioID, sound, currentPosition])

    useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync(); }
        : undefined;
    }, [sound, currentAudioID]);

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
        setPaused(!paused)

    }

    function skipFowardTrack(){
      const index = downloadData.findIndex(object => {
        return object.id === currentAudioID;
      });

    

      if (index < downloadData.length){
        if (isDdownload){
          const forwardThumbNail = defaultThumbnail
          const forwardAudioURI = downloadData[index + 1].uri
          const forwardTitle = downloadData[index + 1].filename.slice(0, -4)
          const forwardID = downloadData[index + 1].id
          setNewSongData(forwardThumbNail, forwardAudioURI, forwardTitle, forwardID)
          setPaused(false)

        }
        else {
          const forwardThumbNail = downloadData[index + 1].data.thumbNail
          const forwardAudioURI = downloadData[index + 1].data.audio
          const forwardTitle = downloadData[index + 1].data.title
          const forwardID = downloadData[index + 1].id
          const forwardArtist = downloadData[index + 1].data.channelTitle
          setNewSongData(forwardThumbNail, forwardAudioURI, forwardTitle, forwardID, forwardArtist)
          setPaused(false)

        }
        
        

      }
    }

    function skipBackwardTrack(){
      const index = downloadData.findIndex(object => {
        return object.id === currentAudioID;
      });

      if (index >= 0){
        if (isDdownload){
          const  backwardThumbNail = defaultThumbnail
          const backwardAudioURI = downloadData[index - 1].uri
          const backwardTitle = downloadData[index - 1].filename.slice(0, -4)
          const backwardID = downloadData[index - 1].id
          const backwardArtist = 'unknown'
        setNewSongData(backwardThumbNail, backwardAudioURI, backwardTitle, backwardID, backwardArtist)

        } else {
          const  backwardThumbNail = downloadData[index - 1].data.thumbNail
          const backwardAudioURI = downloadData[index - 1].data.audio
          const backwardTitle = downloadData[index - 1].data.title
          const backwardID = downloadData[index - 1].id
          const backwardArtist = downloadData[index + 1].data.channelTitle
          setNewSongData(backwardThumbNail, backwardAudioURI, backwardTitle, backwardID, backwardArtist)
        }
        setPaused(false)

      }
    }

    function shuffleTrack(){
      if (isDdownload){
        const randomTrack = Math.floor(Math.random() * downloadData.length);
        const  randomThumbNail = defaultThumbnail
        const randomAudioURI = downloadData[randomTrack].uri
        const randomTitle = downloadData[randomTrack].filename.slice(0, -4)
        const randomID = downloadData[randomTrack].id
        setNewSongData(randomThumbNail, randomAudioURI, randomTitle, randomID)
        setPaused(false)

      } else {
        const randomTrack = Math.floor(Math.random() * downloadData.length);
        const  randomThumbNail = downloadData[randomTrack].data.thumbNail
        const randomAudioURI = downloadData[randomTrack].data.audio
        const randomTitle = downloadData[randomTrack].data.title
        const randomID = downloadData[randomTrack].id
        setNewSongData(randomThumbNail, randomAudioURI, randomTitle, randomID)
        setPaused(false)
      }
        
    }

    function deleteMusicItem(){
      db.collection('audioDownloads')
      .doc(auth.currentUser.uid)
      .collection('userAudios')
      .doc(currentAudioID)
      .delete()

      navigation.goBack()
    }

    function renderModal(){
        
      return (
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Options?</Text>
                  <Pressable
                    style={[styles.button1, styles.buttonClose]}
                    onPress={() => navigation.navigate('AddToMadePlaylist', {playListObject: {id: currentAudioID, data: {
                      audio: currentAudioURI,
                      thumbNail: currentThumbNail,
                      title: currentTitle
                    }}})}>
                    <Text style={styles.textStyle}>Add to playlist</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button1, styles.buttonClose]}
                    onPress={deleteMusicItem}>
                    <Text style={styles.textStyle}>Delete song</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.button1, styles.buttonClose]}
                    onPress={downloadSongToDevice}>
                    <Text style={styles.textStyle}>Download song</Text>
                  </Pressable>
                
                  <Pressable
                    style={[styles.button3, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                  
                </View>
              </View>
            </Modal> 
            
          </View>
        );
  }

  


    return (
      
        <View style={gStyle.container}>
          <ImageBackground style={styles.bgImage} resizeMode='cover' source={BG_IMAGE}>
          <ModalHeader
            left={<Feather color={colors.greyLight} name="chevron-down" />}
            leftPress={() => {navigation.goBack(); dispatch(setAudioURI(null))}}
            right={ <Feather onPress={() => setModalVisible(true)} color={colors.greyLight} name="more-horizontal" />}
            text={playListName != undefined ? playListName + " Playlist" : "Downloads"}
          />
  
          <View style={gStyle.p3}>
            <Image  source={{uri: currentThumbNail}} style={styles.image} />
  
            <View style={[gStyle.flexRowSpace, styles.containerDetails]}>
              <View style={styles.containerSong}>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.song}>
                  {currentTitle}
                </Text>
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
        
                maximumValue={status.durationMillis}
                value={status.positionMillis}
                minimumTrackTintColor={colors.white}
                maximumTrackTintColor={colors.grey3}
                onSlidingComplete={(millis) => setCurrentPosition(millis)}
                
                
                
                
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
                  iconSize={40}
                  onPress={skipBackwardTrack}
                />
                <View style={gStyle.pH3}>
                  <TouchIcon
                    icon={<FontAwesome color={colors.white} name={iconPlay} />}
                    iconSize={80}
                    onPress={togglePlay}
                  />
                </View>
                <TouchIcon
                  icon={<FontAwesome color={colors.white} name="step-forward" />}
                  iconSize={40}
                  onPress={skipFowardTrack}
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
                onPress={() => null}
              />
            </View>
          </View>
          {renderModal()}
        
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
});