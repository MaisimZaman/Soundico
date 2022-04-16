import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Modal, Alert, Pressable, ImageBackground} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';
import WebView from 'react-native-webview';
import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Playlist from '../../components/Playlist';
import { Audio, Video } from 'expo-av';
import { BG_IMAGE } from '../../services/backgroundImage';
import { TextButton } from '../../components/AuthComponents';
import ModalHeader from '../MusicPlayer/ModalHeader';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { colors, device, func, gStyle } from '../MusicPlayer/constants/index';
import TouchIcon from '../MusicPlayer/TouchIcon';
// components






export default function VideoDisplay(props) {
    const {width, height} = Dimensions.get("screen");
    const [modalVisible, setModalVisible] = useState(false);
    const {videoId, videoThumbNail, videoTitle, Search, isPlaylist, playlistVideos, artist='unknown', plInfo} = props.route.params;
    const [currentVideoID, setCurrentVideoID] = useState(videoId)
    const [currentThumbnail, setCurrentThumbnail]= useState(videoThumbNail)
    const [currentTitle, setCurrentTitle] = useState(videoTitle)
    const [page, setPage] = useState(4)
    const [paused, setpasued] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(0)
    const [status, setStatus] = useState(0);
    
    const [recentlyPlayed, setRecentlyPlayed] = useState([])

    const [playingVideo, setPlayingVideo] = useState('null2');
    

    const iconPlay = status.isPlaying ?   'pause-circle' : 'play-circle';

    const video = useRef(null);


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

   //console.log(status)
    

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
        await video.current.playAsync()
      }

      runAudio()

    }, [currentVideoID, currentPosition])
  

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

    
    

    function convertToVideoLink(videoId){
        const videoLink = `https://www.youtube.com/embed/${videoId}`

        return videoLink

    }

    function saveAudioData(downloadURL){
        db.collection('audioDownloads')
            .doc(auth.currentUser.uid)
            .collection("userAudios")
            .add({
                audio: downloadURL,
                thumbNail: currentThumbnail,
                title: currentTitle,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })

            props.navigation.navigate('MusicScreen', {thumbNail: currentThumbnail,
                audioURI: downloadURL, 
                title: currentTitle,
                downloadData: downloadURL,
                            audioID: '2121'
                                })

    }

    function saveAudioPodCastData(downloadURL){
        db.collection('podcastDownloads')
            .doc(auth.currentUser.uid)
            .collection("userPodcasts")
            .add({
                audio: downloadURL,
                thumbNail: currentThumbnail,
                title: currentTitle,
            })

    }

    function saveVideoData(downloadURL){
        db.collection('videoDownloads')
            .doc(auth.currentUser.uid)
            .collection("userVideos")
            .add({
                videoURI: downloadURL,
                thumbNail: currentThumbnail,
                title: currentTitle,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })

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

    

    

     async function downloadAudioOrVideo(isVideo=false, isPodCast=false){
        let childPath;
        let theDownload;

        if (isVideo){
          let info = await ytdl.getInfo(currentVideoID);
          let audioFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
            theDownload = audioFormats[0].url
            console.log(urls)
            childPath = `videoDownloads/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        }
        else {
            let info = await ytdl.getInfo(String(currentVideoID));
            let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
            theDownload = audioFormats[0].url
            console.log(theDownload)
            childPath = `audioDownloads/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        }

      
        
        
        const response = await fetch(theDownload);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                    console.log("This happened")

                    if (isVideo){
                        saveVideoData(snapshot)
                        setModalVisible(false)
            
                    } else {
                        if (isPodCast){
                            saveAudioPodCastData(snapshot)
                            setModalVisible(false)
                        } else {
                            saveAudioData(snapshot);
                            setModalVisible(false)
                        }
                        
                    }  
                
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
        
    }


    function renderModal(){
        
        function renderPlaylistDownload(){
            return (
                <Pressable
                      style={[styles.button4, styles.buttonClose]}
                      onPress={savePlaylistData}>
                      <Text style={styles.textStyle}>Download Playlist</Text>
                </Pressable>
            )
        }
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
                    <Text style={styles.modalText}>How would you like to download it?</Text>
                    <Pressable
                      style={[styles.button1, styles.buttonClose]}
                      onPress={() => downloadAudioOrVideo(true)}>
                      <Text style={styles.textStyle}>Download as Video</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button2, styles.buttonClose]}
                      onPress={() => downloadAudioOrVideo(false)}>
                      <Text style={styles.textStyle}>Download Music Audio only</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button2, styles.buttonClose]}
                      onPress={() => downloadAudioOrVideo(false, true)}>
                      <Text style={styles.textStyle}>Download as Podcast Audio</Text>
                    </Pressable>
                    {isPlaylist ? renderPlaylistDownload() : null}
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


    function renderVideoPlayer(){
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
        
              {renderModal()}
        </ImageBackground>
      </View>
      
    );
    
  
    

    
    
}

const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        height:300,
        width:'120%',
        marginBottom: 20
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
})