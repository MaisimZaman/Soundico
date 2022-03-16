import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity} from 'react-native'
import React, {useState, useEffect} from 'react';
import WebView from 'react-native-webview';
import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Playlist from '../../components/Playlist';



export default function VideoDisplay(props) {
    const {width, height} = Dimensions.get("screen");

    const {videoId, videoThumbNail, videoTitle, Search} = props.route.params;
    const [currentVideoID, setCurrentVideoID] = useState(videoId)
    const [currentThumbnail, setCurrentThumbnail]= useState(videoThumbNail)
    const [currentTitle, setCurrentTitle] = useState(videoTitle)


    const [playingVideo, setPlayingVideo] = useState(convertToVideoLink(videoId));
    const [recentlyPlayed, setRecentlyPlayed] = useState([])

    useEffect(() => {
        const unsubscribe = db.collection('recentlyPlayed')
                          .doc(auth.currentUser.uid)
                          .collection('userRecents')
                          .onSnapshot((snapshot) => setRecentlyPlayed(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data()
                        }))))
    
        return unsubscribe;
        
      }, [])

    useEffect(() => {

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

    async function downloadAudio(){
        let info = await ytdl.getInfo(String(currentVideoID));
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const audioDownload = audioFormats[0].url
        console.log(audioDownload)

        const childPath = `audioDownloads/${auth.currentUser.uid}/${Math.random().toString(36)}`;

        const response = await fetch(audioDownload);
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
                
                    saveAudioData(snapshot);
                
                
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
        

    }

    function renderRecents(){
        function setVideoprops(item){
            setPlayingVideo(convertToVideoLink(item.data.videoId))
            setCurrentVideoID(item.data.videoId)
            setCurrentThumbnail(item.data.videoThumbNail)
            setCurrentTitle(item.data.videoTitle)
        }
        return (
            
            <FlatList
            data={recentlyPlayed}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setVideoprops(item)}>
                <Playlist
                    name={item.data.videoTitle}
                    photoAlbum={item.data.videoThumbNail}
                    create={false}
                />
                </TouchableOpacity>
            )}
            />
        
        )
    }


    return (
        <>
        <View style={{width:'100%',height:height/3,alignItems:'center'}}>
        <WebView
                    style={{ marginTop: 20, width: 330, height: 230 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                    source={{ uri: playingVideo}}/>
        </View>
        <Button title='Download Audio' onPress={downloadAudio}></Button>
        <Text>Recently played</Text>
        
        {renderRecents()}
        
        </>
    )

    
}

const styles = StyleSheet.create({})