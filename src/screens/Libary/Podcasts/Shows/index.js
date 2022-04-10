import React, { useState, useEffect } from 'react';
import { FlatList, Text } from 'react-native';

import PodcastShow from '../../../../components/PodcastShow';
import api from '../../../../services/api';

import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Shows({navigation}) {
  const [shows, setShows] = useState([]);

  

  useEffect(() => {
    db.collection('videoDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userVideos')
                      .orderBy('creation', 'desc')
                      .onSnapshot((snapshot) => setShows(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

  
    
  }, [navigation])

 
 
  return (
    <Container>
      <FlatList
        data={shows}
        key={Math.random().toString(36)}
        //keyExtractor={(item) => item.id}
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
