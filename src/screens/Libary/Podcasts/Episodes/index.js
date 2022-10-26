import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

import EpisodiePodcast from '../../../../components/EpisodiePodcast';
import api from '../../../../services/api';

import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';
import { BG_IMAGE } from '../../../../services/backgroundImage';

export default function Episodes({navigation}) {
  const [episodes, setEpisodes] = useState([]);
  useEffect(() => {
    let unsubscribe = db.collection('podcastDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userPodcasts')
                      .onSnapshot((snapshot) => setEpisodes(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  

  return (
    
    <Container>
      <FlatList
        data={episodes}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MusicScreen', {thumbNail: item.data.thumbNail,
            audioURI: item.data.audio, 
            title: item.data.title,
            downloadData: episodes,
            audioID: item.id,
            artist: item.data.channelTitle
             })}>
          <EpisodiePodcast
            name={item.data.title}
            photo={item.data.thumbNail}
            informations={"Play"}
            ChanelPodcast={item.data.channelTitle?item.data.channelTitle :  "Unknown"}
            AudioURI={item.data.audio}
          />
          </TouchableOpacity>
        )}
      />
    </Container>
   
  );
}


const styles = StyleSheet.create({
  image: {
      flex: 1,
      justifyContent: "center"
    },
   
})