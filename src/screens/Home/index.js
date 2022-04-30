import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, ImageBackground, StyleSheet } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import AlbunsList from '../../components/AlbunsList';

import api from '../../services/api';
import Axios from 'axios';
import { API_KEY } from '../Search/YoutubeApi';

import { Container, Title } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../../../services/firebase';
import { BG_IMAGE } from '../../services/backgroundImage';


export default function Home({navigation}) {

  const [recently, setRecently] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [yourPlaylists, setYourPlaylists] = useState([]);
  const [currentPlaylistData, setCurrentPlaylistData] = useState()



  useEffect(() => {
    const searches = ["Elon Musk",   "How to be a millionaire", "Cosmos podcasts", "poltical podcasts", "Tesla podcasts", 'motivational videos']
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}&key=${API_KEY}`)
      .then(res => {
        const podCastData = res.data.items;
        setPodcasts(podCastData)
        
        
    })

  }, [navigation])

  useEffect(() => {
    const searches = ["Space", "Car", "airplane"]
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}Music&key=${API_KEY}`)
      .then(res => {
        const madeForYou = res.data.items;
        setMadeForYou(madeForYou)
        
        
    })

  }, [navigation])

  useEffect(() => {
    const searches = ["Car Music", "Spider-man Music", "Intersteller Music", "Clasical music", "Workout Music"]
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}&type=playlist&key=${API_KEY}`)
      .then(res => {
        const popularPlaylists = res.data.items;
        setPopularPlaylists(popularPlaylists)
        
        //getPlayListData(popularPlaylists[0].id.playlistId)
        
        
        
    })

  }, [navigation])

  useEffect(() => {
    let unsubscribe = db.collection('playlists')
                      .doc(auth.currentUser.uid)
                      .collection('userPlaylists')
                      .onSnapshot((snapshot) => setYourPlaylists(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])

  useEffect(() => {
    const unsubscribe = db.collection('recentlyPlayed')
                      .doc(auth.currentUser.uid)
                      .collection('userRecents')
                      .orderBy('creation', 'desc')
                      .onSnapshot((snapshot) => setRecently(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    }))))

    return unsubscribe;
    
  }, [navigation])


  async function getPlayListData(item, playlistId){
   

    const response = await Axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${playlistId}&key=${API_KEY}`)
    const playlistVideos = response.data.items
    const videoId = playlistVideos[0].snippet.resourceId.videoId
    const videoThumbNail = playlistVideos[0].snippet.thumbnails.high.url
    const videoTitle = playlistVideos[0].snippet.title
    setCurrentPlaylistData([videoId, videoThumbNail, videoTitle, playlistVideos])
    navigation.navigate("AlbumScreen", {title:currentPlaylistData[2], photoAlbum: currentPlaylistData[1], playlistVideos: currentPlaylistData[3], isCustom: false })
    //navigation.navigate('VideoScreen', {videoId: currentPlaylistData[0], videoThumbNail:currentPlaylistData[1], videoTitle: currentPlaylistData[2], Search: false, isPlaylist: true, playlistVideos: currentPlaylistData[3], plInfo: [item.snippet.title, item.snippet.thumbnails.high.url]})

  }


  function signOutUser(){
    if (auth.currentUser.uid != null &&  auth.currentUser.uid != undefined){
      auth.signOut().then(() => {
          navigation.replace('Login')
      })
  }
  }

  

  return (
    <ImageBackground style={styles.image} source={ BG_IMAGE}>
    <Container>
      <ScrollView>
        <Entypo
          onPress={signOutUser}
          name="cog"
          size={25}
          color="#acacac"
          style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10 }}
        />
        
        <Title>Recently Played</Title>
        <FlatList
          data={recently}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', { rId: item.id, videoId: item.data.videoId, videoThumbNail:item.data.videoThumbNail, videoTitle: item.data.videoTitle, artist: item.data.videoArtist, Search: false, isRecently: true, downloadData: recently})}>
              <AlbunsList
                name={item.data.videoTitle}
                photoAlbum={item.data.videoThumbNail}
                recentPlayed
              />
            </TouchableOpacity>
          )}
        />
        <Title>Trending podcasts</Title>
        <FlatList
          data={podcasts}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {rId: item.id,videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: false, downloadData: podcasts, isRecently: false, })}>
              <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} podcast={true} />
            </TouchableOpacity>
          )}
        />
        <Title>Made For you</Title>
        <FlatList
          data={madeForYou}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {rId: item.id, videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: false, downloadData: madeForYou, isRecently: false, })}>
            <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
            </TouchableOpacity>
          )}
        />
        <Title>Most Popular Playlists</Title>
        <FlatList
          data={popularPlaylists}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => getPlayListData(item, item.id.playlistId)}>
              <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
              </TouchableOpacity>
          )}
        />
        <Title>Your Playlists</Title>
        <FlatList
          data={yourPlaylists}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("AlbumScreen", {title:item.data.playlistTitle, photoAlbum: item.data.playListThumbnail, playlistVideos: item.data.playlistVideos, isCustom: item.data.isCustom })}>
              <AlbunsList name={item.data.playlistTitle} photoAlbum={item.data.playListThumbnail} />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </Container>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
 
  image: {
    flex: 1,
    justifyContent: "center"
  },
 
});
