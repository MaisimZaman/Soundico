import { StyleSheet, Text, View, Button, FlatList, Dimensions, ImageBackground } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Playlist from '../../components/Playlist';
import React, {useState, useEffect} from 'react'
import { Video, AVPlaybackStatus, Audio, VideoFullscreenUpdateEvent } from 'expo-av';
import { auth, db } from '../../../services/firebase';
import { BG_IMAGE } from '../../services/backgroundImage';
//import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

//import * as Permissions from 'expo-permissions';


export default function VideoPlayer(props) {
    const {width, height} = Dimensions.get("screen");

    
    const {thumbNail, title, videoURI, allShows} = props.route.params
    const [currentThumbNail, setCurrentThumbnail] = useState(thumbNail)
    const [currentTitle, setCurrentTitle] = useState(title)
    const [currentVideoURI, setCurrentVideoURI] = useState(videoURI)
    //const [fileURI, setFileURI] = useState(null)
    const video = React.useRef(null);
    const [status, setStatus] = useState({});

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
    

    function renderRecents(){

        
        function setVideoprops(item){
            setCurrentThumbnail(item.data.thumbNail)
            setCurrentTitle(item.data.title)
            setCurrentVideoURI(item.data.videoURI)
        }
        return (
            
            <FlatList
            data={allShows.slice(0, allShows.length-1)}
            //keyExtractor={(item, index) => String(index)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setVideoprops(item)}>
                <Playlist
                    name={item.data.title}
                   
                    photoAlbum={item.data.thumbNail}
                    create={false}
                />
                </TouchableOpacity>
            )}
            />
        
        )
    }

    function downloadFile(){
        const uri = currentVideoURI
        let fileUri = FileSystem.documentDirectory + "small.mp4";
        FileSystem.downloadAsync(uri, fileUri)
        .then(({ uri }) => {
            saveFile(uri);
          })
          .catch(error => {
            console.error(error);
          })
    }
    
    async function saveFile(fileUri){
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status === "granted") {
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync("Download", asset, false)
        }
    }

    function nesssw(){
      
    }

    return (
        <ImageBackground style={styles.image} source={ BG_IMAGE}>
        <View style={{width:'100%',height:height/3,alignItems:'center'}}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: currentVideoURI,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onReadyForDisplay={params => {
            params.naturalSize.orientation = "landscape";
            console.log("params---->", params.naturalSize.orientation);
          }}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        </View>
        
        
        <Text style={{color: "white", fontSize: 25}}>Video Downloads</Text>
        
        {renderRecents()}
        
        </ImageBackground>
    )
    
    

    
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      height:300,
      width:'100%',
      marginBottom: 20
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
  });
  