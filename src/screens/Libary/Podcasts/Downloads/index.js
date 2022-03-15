import React, {useState, useEffect} from 'react';

import { AntDesign } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Playlist from '../../../../components/Playlist';
import {Text} from 'react-native'

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

 


  useEffect(() => {
    const unsubscribe = db.collection('audioDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userAudios')
                      .onSnapshot((snapshot) => setDownloadData(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])


  function renderBody(){
    if (downloadData.length > 0){
      return (
        <FlatList
          data={downloadData}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('MusicScreen', {thumbNail: item.data.thumbNail,
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
    
    
  }
  
  return (
    <>
      {renderBody()}
    </>
  );
}
