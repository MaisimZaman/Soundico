import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, ImageBackground } from 'react-native';

import Playlist from '../../../../components/Playlist';
import api from '../../../../services/api';
import {AlbumMessager} from '../Local/styles'
import { Container } from './styles';
import { auth, db } from '../../../../../services/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BG_IMAGE } from '../../../../services/backgroundImage';

export default function Playlists({navigation}) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let unsubscribe = db.collection('playlists')
                      .doc(auth.currentUser.uid)
                      .collection('userPlaylists')
                      .orderBy("creation", "desc")
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

  if (playlists.length == 0){
    return (
        <Container>
          <AlbumMessager>No created playlists yet</AlbumMessager>
        </Container>
    )
  }

  return (
    
    <Container>
      <FlatList
        data={playlists}
        initialNumToRender={playlists.length}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("AlbumScreen", {title:item.data.playlistTitle, photoAlbum: item.data.playListThumbnail, playlistVideos: item.data.playlistVideos, isCustom: item.data.isCustom, playlistId: item.id })}>
          
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
const styles = StyleSheet.create({
  image: {
      flex: 1,
      justifyContent: "center"
    },
   
})
