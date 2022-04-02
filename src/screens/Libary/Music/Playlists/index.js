import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import Playlist from '../../../../components/Playlist';
import api from '../../../../services/api';

import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Playlists({navigation}) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let unsubscribe = db.collection('playlists')
                      .doc(auth.currentUser.uid)
                      .collection('userPlaylists')
                      .onSnapshot((snapshot) => setPlaylists(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  useEffect(() => {
    async function getData() {
      const response = await api.get('/Playlists');

      //setPlaylists(response.data.YourPlaylists);
    }

    getData();
  }, []);

  

  return (
    <Container>
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={playlists}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("AlbumScreen", {title:item.data.playlistTitle, photoAlbum: item.data.playListThumbnail, playlistVideos: item.data.playlistVideos, isCustom: item.data.isCustom })}>
          
            <Playlist
              name={item.data.playlistTitle}
              photoAlbum={item.data.playListThumbnail}
              create={item.create}
            />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
}
