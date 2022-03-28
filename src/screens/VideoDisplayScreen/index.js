import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Modal, Alert, Pressable, ImageBackground} from 'react-native'
import React, {useState, useEffect} from 'react';
import WebView from 'react-native-webview';
import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Playlist from '../../components/Playlist';
import { Audio } from 'expo-av';
import { BG_IMAGE } from '../../services/backgroundImage';
import { TextButton } from '../../components/AuthComponents';





export default function VideoDisplay(props) {
    const {width, height} = Dimensions.get("screen");
    const [modalVisible, setModalVisible] = useState(false);
    const {videoId, videoThumbNail, videoTitle, Search, isPlaylist, playlistVideos, plInfo} = props.route.params;
    const [currentVideoID, setCurrentVideoID] = useState(videoId)
    const [currentThumbnail, setCurrentThumbnail]= useState(videoThumbNail)
    const [currentTitle, setCurrentTitle] = useState(videoTitle)
    
    const [recentlyPlayed, setRecentlyPlayed] = useState([])

    const [playingVideo, setPlayingVideo] = useState(convertToVideoLink(videoId));
    

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

    useEffect(() => {
        if (isPlaylist){
            const unsubscribe = setRecentlyPlayed(playlistVideos)
            return unsubscribe
        }
        const unsubscribe = db.collection('recentlyPlayed')
                          .doc(auth.currentUser.uid)
                          .collection('userRecents')
                          .onSnapshot((snapshot) => setRecentlyPlayed(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data()
                        }))))
    
        return unsubscribe;
        
      }, [props])


    useEffect(() => {
        console.log("the info")
        console.log(videoId)

        
        if (Search){
            db.collection('recentlyPlayed')
            .doc(auth.currentUser.uid)
            .collection("userRecents")
            .add({
                videoId: currentVideoID,
                videoThumbNail: currentThumbnail,
                videoTitle: currentTitle
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
            console.log("this is happening")
            const youtubeURL = `http://www.youtube.com/watch?v=${currentVideoID}`;
            const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
            theDownload = urls[0].url
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
        if (isVideo){
            saveVideoData(theDownload)
            setModalVisible(false)
        } else {
            if (isPodCast){
                saveAudioPodCastData(theDownload)
                setModalVisible(false)
            } else {
                saveAudioData(theDownload);
                setModalVisible(false)
            }
            
        }
        
        /*
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
        */
    }

    function renderRecents(){
        function setVideoprops(item){
            if (isPlaylist){
                setPlayingVideo(convertToVideoLink(item.snippet.resourceId.videoId))
                setCurrentVideoID(item.snippet.resourceId.videoId)
                setCurrentThumbnail(item.snippet.thumbnails.high.url)
                setCurrentTitle(item.snippet.title)
            }
            else {
                setPlayingVideo(convertToVideoLink(item.data.videoId))
                setCurrentVideoID(item.data.videoId)
                setCurrentThumbnail(item.data.videoThumbNail)
                setCurrentTitle(item.data.videoTitle)
            }
            
        }
        return (
            
            <FlatList
            data={recentlyPlayed}
            keyExtractor={(item, index) => String(index)}
            //keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setVideoprops(item)}>
                <Playlist
                    name={isPlaylist ?  item.snippet.title : item.data.videoTitle}
                    photoAlbum={isPlaylist ? item.snippet.thumbnails.high.url : item.data.videoThumbNail}
                    create={false}
                />
                </TouchableOpacity>
            )}
            />
        
        )
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

    


    return (
        <ImageBackground style={styles.image} resizeMode='cover' source={{uri: BG_IMAGE}}>
        <View style={{width:'100%',height:height/3,alignItems:'center'}}>
        <WebView
                    style={{ marginTop: 20, width: 330, height: 230 }}
                    androidHardwareAccelerationDisabled={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                    source={{ uri: playingVideo}}/>
        </View>
        
       
        <TextButton
                    contentContainerStyle={{
                        height: 40,
                        marginTop: 10,
                        borderRadius: 30,
                        backgroundColor: "#054c85"
                    }}
                    label="Download options"
                    onPress={() => setModalVisible(true)}
                />
        {renderModal()}
        
        <Text style={{color: "white", fontSize: 25}}>{isPlaylist ? "More from this playlist" : 'Recently Played'}</Text>
        {renderRecents()}
        
        </ImageBackground>
    )

    
}

const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
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
    downloadButton: {
        borderRadius: 30,
        padding: 10,
        elevation: 2,
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
})