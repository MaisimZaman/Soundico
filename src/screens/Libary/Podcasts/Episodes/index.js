import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import EpisodiePodcast from '../../../../components/EpisodiePodcast';
import api from '../../../../services/api';

import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';

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
            downloadData: setEpisodes,
            audioID: item.id
             })}>
          <EpisodiePodcast
            name={item.data.title}
            photo={item.data.thumbNail}
            informations={"tune in to elon musk debate"}
            ChanelPodcast={"Jack Studios"}
            AudioURI={item.data.audio}
          />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}
