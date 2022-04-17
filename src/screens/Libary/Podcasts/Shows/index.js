import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ImageBackground, StyleSheet } from 'react-native';

import PodcastShow from '../../../../components/PodcastShow';
import api from '../../../../services/api';

import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BG_IMAGE } from '../../../../services/backgroundImage';

export default function Shows({navigation}) {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(shows.length -1)

  

  useEffect(() => {
    db.collection('videoDownloads')
                      .doc(auth.currentUser.uid)
                      .collection('userVideos')
                      .onSnapshot((snapshot) => setShows(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

  
    
  }, [navigation])

  if (shows.length == 0){
    return (
        <View>
            <Text >No downloads yet</Text>
        </View>
    )
}

  else if (shows.length > 7) {

      var qDownloads = shows.slice(0, page)
  }
  else {
      var qDownloads = shows;
  }
 
  return (
   
    <Container>
      <FlatList
        data={qDownloads}
        key={Math.random().toString(36)}
        //keyExtractor={(item) => item.id}
        //keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('VideoPlayer',{thumbNail:item.data.thumbNail, title: item.data.title, videoURI:item.data.videoURI, allShows: shows  })}>
            <PodcastShow name={item.data.title} photoAlbum={item.data.thumbNail} />
            </TouchableOpacity>
          
        )}
        //onEndReachedThreshold={0.7}
        //onEndReached={() => setPage(page => page+7)}
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
