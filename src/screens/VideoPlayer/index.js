import { StyleSheet, Text, View, Button, FlatList, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Playlist from '../../components/Playlist';
import React, {useState, useEffect} from 'react'
import { Video, AVPlaybackStatus, Audio, VideoFullscreenUpdateEvent } from 'expo-av';
import { auth, db } from '../../../services/firebase';


export default function VideoPlayer(props) {
    const {width, height} = Dimensions.get("screen");

    
    const {thumbNail, title, videoURI, allShows} = props.route.params
    const [currentThumbNail, setCurrentThumbnail] = useState(thumbNail)
    const [currentTitle, setCurrentTitle] = useState(title)
    const [currentVideoURI, setCurrentVideoURI] = useState(videoURI)
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
            data={allShows}
            keyExtractor={(item, index) => String(index)}
            //keyExtractor={(item) => `${item.id}`}
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

    

    return (
        <>
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
        
        <Text>Recently played</Text>
        
        {renderRecents()}
        
        </>
    )
    
    return (
      <View style={styles.container}>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: currentVideoURI,
          }}
          useNativeControls
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <View style={styles.buttons}>
          <Button
            title={status.isPlaying ? 'Pause' : 'Play'}
            onPress={() =>
              status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
            }
          />
        </View>
      </View>
    );

    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      width: 320,
      height: 200,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  