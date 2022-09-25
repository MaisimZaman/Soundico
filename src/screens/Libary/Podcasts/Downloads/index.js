import React, {useState, useEffect} from 'react';

import { AntDesign } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Playlist from '../../../../components/Playlist';
import {Text, Alert, StyleSheet, Modal, Pressable, Button, TextInput, View, ImageBackground } from 'react-native'

import {
  Container,
  DownloadMessager,
  SubMessage,
  ContainerButton,
} from './styles';
import {  AlbumMessager } from '../../Music/Local/styles';
import { TextButton } from '../../../ProfileScreen/ProfileComponents';
import { auth, db } from '../../../../../services/firebase';
import { BG_IMAGE } from '../../../../services/backgroundImage';
import { selectAudioURI } from '../../../../../services/slices/navSlice';



export default function Downloads({navigation}) {

  const [downloadData, setDownloadData] = useState([]);
  const [page, setPage] = useState(downloadData.length +10)
  //const [modalVisible, setModalVisible] = useState(false);
  const [AudioURI, setAudioURI] = useState('')

 
  //console.warn(downloadData.length)

  

  

  useEffect(() => {
    function maindownloadLoad(){
      db.collection('audioDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userAudios')
                      .orderBy('creation','desc')
                      .onSnapshot((snapshot) => setDownloadData(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data(),
                        url: doc.data().audio, // Load media from the network
                        title: doc.data().title,
                        artist: doc.data().channelTitle,
                        artwork: doc.data().thumbNail, // Load artwork from the network
                        duration: 10000// Duration in seconds
                    }))))

    }

    maindownloadLoad()
   

    //return unsubscribe;
    
    
  }, [])


  //console.warn(downloadData.length)

  function renderBody(){

    
  
   if (downloadData.length > 1) {

      var qDownloads = downloadData.slice(0, page)
    }
    else {
        var qDownloads = downloadData;
    }
    
      return (    
         
        <FlatList
          data={qDownloads}
          keyExtractor={(item, index) => item.id}
          initialNumToRender={downloadData.length-1}
          renderItem={({ item }) => (
            <TouchableOpacity

                    onPress={() => navigation.navigate('MusicScreen', {thumbNail: item.data.thumbNail,
                                                                      audioURI: item.data.audio, 
                                                                      title: item.data.title,
                                                                      downloadData: downloadData,
                                                                                  audioID: item.id,
                                                                                  artist: item.data.channelTitle
                                                                                   })}>
              <Playlist
                name={item.data.title}
                photoAlbum={item.data.thumbNail}

                onEndReachedThreshold={0.5}           
                //onScrollToTop={() => setPage(page - 5)}
                onEndReached={() => setPage(page+7)}
            
                //create={false}
        
              />
            </TouchableOpacity>
          )}
        />
       
        
       
      )
      
    
    
    
  }

  if (downloadData.length == 0){
    return (
        <Container>
          <AlbumMessager>No saved content yet</AlbumMessager>
        </Container>
    )
  }
  
  return (
    <>
      <TextButton
          contentContainerStyle={{
              height: 40,
              marginTop: 10,
              borderRadius: 30,
              backgroundColor: "#054c85"
          }}
          label="Create a playlist?"
        
          onPress={() => navigation.navigate('NamePlaylist')}
        />
      {renderBody()}
     
    </>
  );
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