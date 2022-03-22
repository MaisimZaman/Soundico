import React, {useState, useEffect} from 'react';

import { AntDesign } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Playlist from '../../../../components/Playlist';
import {Text, Alert, StyleSheet, Modal, Pressable} from 'react-native'

import {
  Container,
  DownloadMessager,
  SubMessage,
  ContainerButton,
  TextButton,
} from './styles';
import { auth, db } from '../../../../../services/firebase';
import { View } from 'react-native-web';

export default function Downloads({navigation}) {

  const [downloadData, setDownloadData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

 


  useEffect(() => {
    let unsubscribe = db.collection('audioDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userAudios')
                      .onSnapshot((snapshot) => setDownloadData(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  function deleteDownload(){

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
                <Text style={styles.modalText}>Would you like to delete this download?</Text>
                <Pressable
                  style={[styles.button1, styles.buttonClose]}
                  onPress={deleteDownload}>
                  <Text style={styles.textStyle}>Delete</Text>
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

 


  function renderBody(){
    
      return (       
        <FlatList
          data={downloadData}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <TouchableOpacity
            onLongPress={() => setModalVisible(true)} 
            onPress={() => navigation.navigate('MusicScreen', {thumbNail: item.data.thumbNail,
                                                                                  audioURI: item.data.audio, 
                                                                                  title: item.data.title,
                                                                                  downloadData: downloadData,
                                                                                  audioID: item.id
                                                                                   })}>
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