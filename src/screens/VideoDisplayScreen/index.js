import { StyleSheet, Text, View, Dimensions, Button} from 'react-native'
import React, {useState} from 'react';
import WebView from 'react-native-webview';
import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'



export default function VideoDisplay(props) {
    const {width, height} = Dimensions.get("screen");

    const {videoId, videoThumbNail, videoTitle} = props.route.params;

    const [playingVideo, setPlayingVideo] = useState(convertToVideoLink(videoId));
    

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
                thumbNail: videoThumbNail,
                title: videoTitle,
            })

    }

    async function downloadAudio(){
        let info = await ytdl.getInfo(String(videoId));
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




    return (
        <>
            <View style={{width:'100%',height:height/3,alignItems:'center'}}>
                    <WebView
                    style={{ marginTop: 20, width: 330, height: 230 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsFullscreenVideo={true}
                    source={{ uri: playingVideo}}
            />
            </View>


            <View>
                <Button title='Download Audio' onPress={downloadAudio}></Button>

            </View>
        </>
    )
}

const styles = StyleSheet.create({})