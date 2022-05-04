import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, Text, ImageBackground, StyleSheet, View } from 'react-native';

import GenreMusic from '../../components/GenreMusic';
import SearchBar from '../../components/SearchBar';
import api from '../../services/api';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { API_KEY } from './YoutubeApi';
import Axios from 'axios';
import PodcastShow from '../../components/PodcastShow';
import { TextButton } from '../../components/AuthComponents';

import { Container, Title } from './styles';
import { BG_IMAGE } from '../../services/backgroundImage';

import {useSelector} from 'react-redux'


import { selectAudioURI } from '../../../services/slices/navSlice';
import Artist from '../../components/Artist';




export default function Search({navigation}) {
  const [yourTop, setYourTop] = useState([]);
  //const [allGenres, setAllGenres] = useState([]);
  const [YOffSet, setYOffSet] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [allYTData, setYTData] = useState([]);
  const [currentPlaylistData, setCurrentPlaylistData] = useState([])
  const [placeholder, setPlaceholder] = useState('Search for Music')
  const [searchType, setSearchType] = useState('Music')
  const [searchOn, setSearchOn] = useState(false)
  const audioURI = useSelector(selectAudioURI)

  
  //useEffect(() => {
  //  searchForVideos()
  //}, [searchTypes])

  useEffect(() => {
    if (searchText == ''){
      setSearchOn(false)
    }
  }, [searchText])

  useEffect(() => {
    if (searchType == 'Music'){
        setPlaceholder('Search for Music')
    }
    else if (searchType == 'Videos'){
      setPlaceholder('Search for Videos')
    }
    else if (searchType == 'Video Link'){
      setPlaceholder('Paste in YouTubeVideo Link')
    }
    else if (searchType == 'Playlists'){
      setPlaceholder("Search for playlists")
    }
    else if (searchType == 'Channel'){
      setPlaceholder("Search for Channel")
    }


  }, [searchType])

  const listOFColours = ["blue", "green", "white", "orange", "yellow", "purple"]

  const allGenres = [
    {
      name: "Pop",
      color: "#0e3fed",
      photoAlbum: ""
    },
    {
      name: "Motivational",
      color: "#0eed55"
    },
    {
      name: "Rock",
      color: "#ed0e0e"
    },
    {
      name: "Electro",
      color: "#4d6feb"
    },
    {
      name: "Folk",
      color: "#510eed"
    },
    {
      name: "Clasical",
      color: "#deed0e"
    },

  ]

  const searchTypes = [
    {
      name: "Music",
      color: "#1e2ee6",
      id: 1
    },
    {
      name: "Videos",
      color: "#1e2ee6",
      id: 2
    },
    {
      name: "Video Link",
      color: "#1e2ee6",
      id: 3
    },
    {
      name: "Playlists",
      color: "#1e2ee6",
      id: 4
    },
    {
      name: "Channel",
      color: "#1e2ee6",
      id: 5
    }

  ]


  function searchForVideos(){
    console.log(searchType)
    if (searchType == "Playlists"){
      Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText} music&type=playlist&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
    }
    else if (searchType == "Video Link"){
      const searchID = searchText.slice(17, 28)
      console.warn(searchID)
      Axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&maxResults=30&id=${searchID}&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
        
      
    }
    else if (searchType == 'Channel'){
      
      console.warn("true")
      Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText}&type=channel&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
        
      
    }
    else  {
      Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText + searchType}&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
    }

    setSearchOn(true)
    
  }

 

  async function getPlayListData(item, playlistId){
   
    console.log(playlistId)
    const response = await Axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=30&playlistId=${playlistId}&key=${API_KEY}`)
    const playlistVideos = response.data.items
    const videoId = playlistVideos[0].snippet.resourceId.videoId
    const videoThumbNail = playlistVideos[0].snippet.thumbnails.high.url
    const videoTitle = playlistVideos[0].snippet.title
    setCurrentPlaylistData([videoId, videoThumbNail, videoTitle, playlistVideos])
    navigation.navigate("AlbumScreen", {title:currentPlaylistData[2], photoAlbum: currentPlaylistData[1], playlistVideos: currentPlaylistData[3], isCustom: false, searchedVideo: true })

  }

  async function getChannelData(item, channelId){
    const response = await Axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`)
    const channelVideos = response.data.items
    setCurrentPlaylistData(channelVideos)
    navigation.navigate("AlbumScreen", {title:item.snippet.title, photoAlbum: item.snippet.thumbnails.high.url, playlistVideos: currentPlaylistData, isCustom: false, searchedVideo: true })
  }


  function searchForType(item, playlistId){

    if (searchType == "Playlists"){
      getPlayListData(item, playlistId)
    }
    else if (searchType == "Video Link"){
      navigation.navigate('VideoScreen', {videoId: item.id,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: true })
    }
    else if (searchType ==  "Channel"){
      getChannelData(item, playlistId)
    }
    else {
      navigation.navigate('VideoScreen', {rId: item.id, videoId: item.id.videoId,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: true, downloadData: allYTData, isRecently: false })
    }
  }


  function renderSearches(){
    if (searchOn){
      if (searchType == 'Channel'){
        return (
          <FlatList
            data={allYTData}
            keyExtractor={(item) => item.etag}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => searchForType(item, item.id.channelId)}>
                <Artist isSearch={true} name={item.snippet.title} photo={item.snippet.thumbnails.high.url}></Artist>
              </TouchableOpacity>
              
            )}
          ></FlatList>
        )

      }
      return (
        <FlatList
          data={allYTData}
          keyExtractor={(item) => item.etag}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => searchForType(item, item.id.playlistId)}>
              <PodcastShow isSearch={true} name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url}></PodcastShow>
            </TouchableOpacity>
            
          )}
        ></FlatList>
      )
    }
    return (
      <>
      <FlatList
          data={allGenres}
          numColumns={2}
          ListHeaderComponent={<Title>Browse All</Title>}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
              <GenreMusic name={item.name} color={item.color} navigationFunc={() => navigation.navigate('TopicContent', {topic: item.name})} />
           
          )}
        />
  </>
    )
  }

  

  return (
    <ImageBackground style={styles.image} source={ BG_IMAGE}>
     
    <Container playerOn={audioURI == null ? false : true}>
      <Title YOffSet={YOffSet} search>
        Search
      </Title>

    <TextInput 
    style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: "#fff", height: 45, width: "94%", borderRadius: 10}}
    placeholder={placeholder}
    onChangeText={(text) => setSearchText(text)}
    value={searchText}
    onSubmitEditing={searchForVideos}
    
    ></TextInput>
        
     

      <View>
        <FlatList
                    horizontal
                    data={searchTypes}
                    listKey="TopSearches"
                    keyExtractor={item => `TopSearches-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        marginTop: 12
                    }}
                    renderItem={({ item, index }) => (
                        <TextButton
                            label={item.name}
                            onPress={() => setSearchType(item.name)}
                            contentContainerStyle={{
                                paddingVertical: 12,
                                paddingHorizontal: 14,
                                marginLeft: index == 0 ? 14 : 12,
                                marginRight: index == searchTypes.length - 1 ? 14 : 0,
                                borderRadius: 12,
                                backgroundColor: "#E5E5E5"
                            }}
                            labelStyle={{
                                color: "#7F7F7F",
                                fontFamily: "Roboto-Bold", fontSize: 16, lineHeight: 22 
                            }}
                        />
                    )}
                />

        {renderSearches()}
      </View>
    </Container>
    
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
 
  image: {
    flex: 1,
    justifyContent: "center",
   
    
  },
 
});

