import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, ImageBackground, StyleSheet } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import AlbunsList from '../../components/AlbunsList';

import api from '../../services/api';
import Axios from 'axios';
import { API_KEY } from '../Search/YoutubeApi';

import { Container, Title } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, db } from '../../../services/firebase';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import LinearGradient from '../TopicContent/LinearGradient'
import {device, colors} from '../MusicPlayer/constants'
import {
  AdMobInterstitial,
 
} from 'expo-ads-admob';
import { AD_UNIT_ID } from '../VideoDisplayScreen/AddUnitKey';
import TrackPlayer, {Capability, useProgress, Event, useTrackPlayerEvents, State} from 'react-native-track-player';


export default function Home({navigation}) {

  const [recently, setRecently] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [popularPlaylists, setPopularPlaylists] = useState([]);
  const [yourPlaylists, setYourPlaylists] = useState([]);
  const [recordList, setRecordList] = useState([])
  const headerColours = ["#0327a6", "#5e0002", "#555f66", "#04631d"]

  useEffect(() => {
    async function run(){
      const { status } = await requestTrackingPermissionsAsync();
      if (status === 'granted') {
        console.log('Tracking permission successful');
      }
    }

    run()
    
  }, []);


  useEffect(() => {
    async function setup() {
      await TrackPlayer.setupPlayer({})
      //await TrackPlayer.skip(index);
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
          Capability.SeekTo,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      })
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add([]);
      //TrackPlayer.play();
    }

    setup()
  }, [])

  useEffect(() => {
    async function showAd(){
      const REVIEWER_ACCOUNT = "13WiiEF5wRRlKwpMEHx5hCFTlPq1"


      

      if (auth.currentUser.uid != REVIEWER_ACCOUNT){
        console.log("true")
        await AdMobInterstitial.setAdUnitID(AD_UNIT_ID); // Test ID, Replace with your-admob-unit-id
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
        await AdMobInterstitial.showAdAsync();
      } else {
        console.log("false")
      }
 
      
      

      
    }
    
    showAd()
  }, [])

  


  useEffect(() => {
    var docRef = db.collection("searchRecord").doc(auth.currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {

        

        if (doc.data().recordList!= undefined){
          setRecordList(doc.data().recordList)
        }
          
      } else {
         setRecordList([])
        
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }, [])


  



  useEffect(() => {

    const searches = ["music",  "Car BASS Music","Car BASS Music", "dupstep music"]
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}&key=${API_KEY}`)
      .then(res => {
        const podCastData = res.data.items;
        setPodcasts(podCastData)
        
        
    })

  }, [navigation])

  useEffect(() => {
    let searches;

    if (recordList.length == 0){
      searches = ["Space", "Car bass", "aviation short", "clasical", "Adventure"]
    } else {
      searches = recordList
    }
    
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText + ' Music'}&key=${API_KEY}`)
      .then(res => {
        const madeForYou = res.data.items;
        //console.log(madeForYou)
        setMadeForYou(madeForYou)
        
        
    })

  }, [navigation, recordList])

  useEffect(() => {
    let searches;
    if (recordList.length == 0){
       searches = ["Car Music",   "Relaxing Music", "Adventure Music", "Study Music"]
    } else {
      searches = recordList
    }
    
    const searchText = searches[Math.floor(Math.random() * (searches.length))]
    Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchText}&type=playlist&key=${API_KEY}`)
      .then(res => {
        const popularPlaylists = res.data.items;
        setPopularPlaylists(popularPlaylists)
        
        //getPlayListData(popularPlaylists[0].id.playlistId)
        
        
        
    })

  }, [navigation, recordList])

  useEffect(() => {
    let unsubscribe = db.collection('playlists')
                      .doc(auth.currentUser.uid)
                      .collection("userPlaylists")
                      .orderBy("creation", "desc")
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
   
    
    let response = []
      response = await Axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=100&playlistId=${playlistId}&key=${API_KEY}`)  
      if (response != []){

        const playlistVideos = response.data.items
        //const videoId = playlistVideos[0].snippet.resourceId.videoId
        const videoThumbNail = playlistVideos[0].snippet.thumbnails.high.url
        const videoTitle = playlistVideos[0].snippet.title
        
        
        
        
        navigation.navigate("AlbumScreen", {title:videoTitle, photoAlbum: videoThumbNail, playlistVideos: playlistVideos, isCustom: false, isPlaylist: true })
      
      }

    

    

   
    
    

    

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
  
    <View style={styles.containerLinear}>
    <LinearGradient fill={headerColours[Math.floor(Math.random() * (headerColours.length))]} />
    
    </View>
    
    
    <ScrollView>
      <Entypo
            onPress={signOutUser}
            name="cog"
            size={25}
            color="#acacac"
            style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10 }}
          />
        
       
        
        <View>
          <Title>Recently Played</Title>
          <FlatList
            data={recently}
            keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View>
              <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', { rId: item.id, videoId: item.data.videoId, videoThumbNail:item.data.videoThumbNail, videoTitle: item.data.videoTitle, artist: item.data.videoArtist, Search: false, isRecently: true, downloadData: recently, channelId: item.data.channelId})}>
                <View style={styles.ContainerImage}>
                <AlbunsList
                  name={item.data.videoTitle}
                  photoAlbum={item.data.videoThumbNail}
                  recentPlayed
                />
                </View>
                </TouchableOpacity>
                </View>
            )}
          />
        </View>

        <View>
          <Title>Trending</Title>
          <FlatList
            data={podcasts}
            keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {rId: item.id,videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: false, downloadData: podcasts, isRecently: false, channelId: item.snippet.channelId })}>
                <View style={styles.ContainerImage}>
                <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} podcast={true} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View>
          <Title>Made For you</Title>
          <FlatList
            data={madeForYou}
            keyExtractor={(item) => `${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {rId: item.id, videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: false, downloadData: madeForYou, isRecently: false, channelId: item.snippet.channelId })}>
                <View style={styles.ContainerImage}>
                <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <View>
          <Title>Most Popular Playlists</Title>
          <FlatList
            data={popularPlaylists}
            keyExtractor={(item) => item.id.playlistId}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => getPlayListData(item, item.id.playlistId)}>
                <View style={styles.ContainerImage}>
                <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} />
                </View>
                </TouchableOpacity>
            )}
          />
          <Title>Your Playlists</Title>
        </View>

        <View>
        <FlatList
          data={yourPlaylists}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("AlbumScreen", {title:item.data.playlistTitle, photoAlbum: item.data.playListThumbnail, playlistVideos: item.data.playlistVideos, isCustom: item.data.isCustom, playlistId: item.id })}>
              <View style={styles.ContainerImage}>
              <AlbunsList name={item.data.playlistTitle} photoAlbum={item.data.playListThumbnail} />
              </View>
            </TouchableOpacity>
          )}
        />
        </View>

       
    </ScrollView>
    </Container>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
 
  image: {
    flex: 1,
    justifyContent: "center",
    marginTop: "0%",
  },
  containerFixed: {
    alignItems: 'center',
    paddingTop: device.iPhoneNotch ? 94 : 60,
    position: 'absolute',
    width: '100%'
  },
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  ContainerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 1.8,
    shadowRadius: 12,
    zIndex: device.web ? 20 : 0
  },
 
});
