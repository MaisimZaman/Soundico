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

export default function Search({navigation}) {
  const [yourTop, setYourTop] = useState([]);
  //const [allGenres, setAllGenres] = useState([]);
  const [YOffSet, setYOffSet] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [allYTData, setYTData] = useState([]);
  const [currentPlaylistData, setCurrentPlaylistData] = useState([])
  const [placeholder, setPlaceholder] = useState('Search for Music')
  const [searchType, setSearchType] = useState('Music')

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


  }, [searchType])

  const listOFColours = ["blue", "green", "white", "orange", "yellow", "purple"]

  const allGenres = [
    {
      name: "Music",
      color: "blue"
    },
    {
      name: "Podcasts",
      color: "blue"
    },
    {
      name: "Interviews",
      color: "blue"
    },
    {
      name: "Speaches",
      color: "blue"
    },
    {
      name: "Motivational Speaches",
      color: "blue"
    },
    {
      name: "Stories",
      color: "blue"
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
    }

  ]


  function searchForVideos(){
    console.log(searchType)
    if (searchType == "Playlists"){
      Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchText}&type=playlist&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
    }
    else if (searchType == "Video Link"){
      const searchID = searchText.slice(17, 28)
      console.warn(searchID)
      Axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${searchID}&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
        
        
    }
    else {
      Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText + searchType}&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
    }

    
    
  }

  useEffect(() => {
    async function getData() {
      const response = await api.get('/Categories');

      setYourTop(response.data.TopGenres);
      //setAllGenres(response.data.All);
    }

    getData();
  }, []);

  async function getPlayListData(item, playlistId){
   
    console.warn(playlistId)
    const response = await Axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}`)
    const playlistVideos = response.data.items
    const videoId = playlistVideos[0].snippet.resourceId.videoId
    const videoThumbNail = playlistVideos[0].snippet.thumbnails.high.url
    const videoTitle = playlistVideos[0].snippet.title
    setCurrentPlaylistData([videoId, videoThumbNail, videoTitle, playlistVideos])
    navigation.navigate('VideoScreen', {videoId: videoId, videoThumbNail:videoThumbNail, videoTitle: videoTitle, Search: true, isPlaylist: true, playlistVideos: playlistVideos, plInfo: [item.snippet.title, item.snippet.thumbnails.high.url]})

  }


  function searchForType(item, playlistId){

    if (searchType == "Playlists"){
      getPlayListData(item, playlistId)
    }
    else if (searchType == "Video Link"){
      navigation.navigate('VideoScreen', {videoId: item.id,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, Search: true })
    }
    else {
      navigation.navigate('VideoScreen', {videoId: item.id.videoId,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, Search: true })
    }
  }


  function renderSearches(){
    if (searchText != ''){
      return (
        <FlatList
          data={allYTData}
          keyExtractor={(item) => item.etag}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => searchForType(item, item.id.playlistId)}>
              <PodcastShow name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url}></PodcastShow>
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
              <GenreMusic name={item.name} color={"#4d6feb"} />
          )}
        />
  </>
    )
  }

  

  return (
    <ImageBackground style={styles.image} source={{uri: BG_IMAGE}}>
     
    <Container >
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

