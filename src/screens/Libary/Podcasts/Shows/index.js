import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import PodcastShow from '../../../../components/PodcastShow';
import api from '../../../../services/api';

import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Shows({navigation}) {
  const [shows, setShows] = useState([]);



  useEffect(() => {
    const unsubscribe = db.collection('videoDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userVideos')
                      .onSnapshot((snapshot) => setShows(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  useEffect(() => {
    async function getData() {
      const response = await api.get('/PodCasts');

      //setShows(response.data.Shows);
    }

    getData();
  }, []);

  return (
    <Container>
      <FlatList
        data={shows}
        keyExtractor={(item, index) => String(index)}
        //keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('VideoPlayer',{thumbNail:item.data.thumbNail, title: item.data.title, videoURI:item.data.videoURI, allShows: shows  })}>
            <PodcastShow name={item.data.title} photoAlbum={item.data.thumbNail} />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}
