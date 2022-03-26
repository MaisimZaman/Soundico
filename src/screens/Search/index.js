import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, Text, ImageBackground, StyleSheet } from 'react-native';

import GenreMusic from '../../components/GenreMusic';
import SearchBar from '../../components/SearchBar';
import api from '../../services/api';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { API_KEY } from './YoutubeApi';
import Axios from 'axios';
import PodcastShow from '../../components/PodcastShow';

import { Container, Title } from './styles';
import { BG_IMAGE } from '../../services/backgroundImage';

export default function Search({navigation}) {
  const [yourTop, setYourTop] = useState([]);
  //const [allGenres, setAllGenres] = useState([]);
  const [YOffSet, setYOffSet] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [allYTData, setYTData] = useState([]);
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


  }, [searchType])

  const listOFColours = ["blue", "green", "white", "orange", "yellow", "purple"]

  const allGenres = [
    {
      name: "Rock",
      color: "blue"
    },
    {
      name: "Jazz",
      color: "blue"
    },
    {
      name: "Pop",
      color: "blue"
    },
    {
      name: "Indie rock",
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
    }

  ]


  function searchForVideos(){
    console.log(searchType)
    if (setSearchType == 'Video Link'){
      console.log("went throuh")
      const searchID = searchText.slice(24, 35)
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

  const handeScroll = (props) => {
    const yOffSet = props.nativeEvent.contentOffset.y;
    setYOffSet(yOffSet);
  };


  function renderSearches(){
    if (searchText != ''){
      return (
        <FlatList
          data={allYTData}
          keyExtractor={(item) => item.etag}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('VideoScreen', {videoId: item.id.videoId,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, Search: true })}>
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
            <GenreMusic name={item.name} color={item.color} />
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
        
     

      <ScrollView scrollEventThrottle onScroll={handeScroll}>
        <FlatList
          data={searchTypes}
          numColumns={2}
          ListHeaderComponent={<Title>Genre</Title>}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSearchType(item.name)}>
              <GenreMusic name={item.name} color={listOFColours[Math.floor(Math.random() * listOFColours.length)]} />
            </TouchableOpacity>
          )}
        />

        {renderSearches()}
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

