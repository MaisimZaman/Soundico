import React, {useEffect, useState} from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Playlist from '../../../../components/Playlist';

import { Container, AlbumMessager } from './styles';
import * as MediaLibrary from 'expo-media-library';

export default function Albums({navigation}) {

  const [audioFiles, setAudioFiles] = useState([]);
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

  

  async function getAudioFiles(){
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      
      //albumId: "1825329292"
    })

    setAudioFiles(media.assets)
  }



  console.warn(audioFiles.length)
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
                    
                    onPress={() => navigation.navigate('MusicScreen', {thumbNail: defaultThumbnail,
                                                                      audioURI: item.uri, 
                                                                      title: item.filename.slice(0, -4),
                                                                      downloadData: audioFiles,
                                                                                  audioID: item.id,
                                                                                  artist: 'unknown',
                                                                                  isDdownload: true
                                                                                   })}>
                                                                                   
              <Playlist
                name={item.filename.slice(0, -4)}
                photoAlbum={defaultThumbnail}
            
                //create={false}
        
              />
            </TouchableOpacity>
          )}
        />
  );
}
