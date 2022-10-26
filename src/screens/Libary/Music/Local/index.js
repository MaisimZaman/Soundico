import React, {useEffect, useState} from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Playlist from '../../../../components/Playlist';

import { Container, AlbumMessager } from './styles';
import * as MediaLibrary from 'expo-media-library';
import TrackPlayer, {Capability, useProgress, Event, useTrackPlayerEvents, State} from 'react-native-track-player';

export default function Albums({navigation}) {

  const [audioFiles, setAudioFiles] = useState([]);
  const [trackFiles, setTrackFiles] = useState([])
  
  const defaultThumbnail = 'https://t3.ftcdn.net/jpg/04/54/66/12/360_F_454661277_NtQYM8oJq2wOzY1X9Y81FlFa06DVipVD.jpg'

  useEffect(() => {
    async function runMain(){
      const { status }  = await MediaLibrary.requestPermissionsAsync();

        
        if (status === "granted") {
          getAudioFiles()
        }
    }

    runMain()
  }, [])

  useEffect(() => {
    setTrackFiles(audioFiles.map(doc => ({
      id: doc.id,
      data: trackFiles,
      url: audioFiles[0].uri, // Load media from the network
      title: doc.filename,
      artist: "unknown",
      artwork: audioFiles[0].uri, // Load artwork from the network
      duration: doc.duration
  })))
  }, [])

  

  

  async function getAudioFiles(){
    const albumData = await MediaLibrary.getAlbumAsync("SoundicoDownloads")

  


    

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'video',
      album: albumData,
      sortBy: 'creationTime',
      first: 30,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   

    })
                                              

    

    setAudioFiles(media.assets)
    
  }
                                
  console.log(audioFiles)

  



  if (audioFiles.length == 0){
    return (
        <Container>
          <AlbumMessager>No downloaded audio files</AlbumMessager>
        </Container>
    )
  }

else if (audioFiles.length > 7) {

    var qDownloads = audioFiles.slice(0, audioFiles.length-1)
}
else {
    var qDownloads =  audioFiles;
}
  return (
    <FlatList
          data={qDownloads}
          key={({item}) => item.id}
          initialNumToRender={audioFiles.length}
          renderItem={({ item }) => (
            <TouchableOpacity
                    
                    onPress={() => navigation.navigate('MusicScreen', {thumbNail: item.uri,
                                                                      audioURI: item.uri, 
                                                                      title: item.filename.slice(0, -4),
                                                                      downloadData: trackFiles,
                                                                                  audioID: item.id,
                                                                                  artist: 'unknown',
                                                                                  isDdownload: true
                                                                                   })}>
                                                                                   
              <Playlist
                name={item.filename.slice(0, -4)}
                photoAlbum={item.uri}
            
                //create={false}
        
              />
            </TouchableOpacity>
          )}
        />
  );
}
