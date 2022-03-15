import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, Text } from 'react-native';

import GenreMusic from '../../components/GenreMusic';
import SearchBar from '../../components/SearchBar';
import api from '../../services/api';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { API_KEY } from './YoutubeApi';
import Axios from 'axios';
import PodcastShow from '../../components/PodcastShow';

import { Container, Title } from './styles';

export default function Search({navigation}) {
  const [yourTop, setYourTop] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [YOffSet, setYOffSet] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [allYTData, setYTData] = useState([]);


  function searchForVideos(){
    Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchText + 'music'}&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
        
        
    })
  }

  useEffect(() => {
    async function getData() {
      const response = await api.get('/Categories');

      setYourTop(response.data.TopGenres);
      setAllGenres(response.data.All);
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
      <Text>No results found</Text>
    )
  }

  

  return (
    <Container >
      <Title YOffSet={YOffSet} search>
        Search
      </Title>

    <TextInput 
    style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: "#fff", height: 45, width: "94%", borderRadius: 10}}
    placeholder="Search for Music or Podcasts"
    onChangeText={(text) => setSearchText(text)}
    value={searchText}
    onSubmitEditing={searchForVideos}
    
    ></TextInput>
        
     

      <ScrollView scrollEventThrottle onScroll={handeScroll}>
        <FlatList
          data={yourTop}
          numColumns={2}
          ListHeaderComponent={<Title>Genre</Title>}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator
          renderItem={({ item }) => (
            <GenreMusic name={item.name} color={item.color} />
          )}
        />

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
      </ScrollView>
     {renderSearches()}
    </Container>
  );
}



