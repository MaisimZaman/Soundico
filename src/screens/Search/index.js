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
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';

import {useSelector} from 'react-redux'
import { AlbumMessager } from '../Libary/Music/Local/styles';

import { selectAccentColour, selectAudioURI } from '../../../services/slices/navSlice';
import Artist from '../../components/Artist';

import LineItemSong from '../TopicContent/LineItemSong';
import LinearGradient from '../TopicContent/LinearGradient'
import { auth, db } from '../../../services/firebase';
import { pickedColour } from '../Home/pickedHeaderColour';




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
  const [createNewRecord, setCreateNewRecord] = useState(true)
  const [recordList, setRecordList] = useState([])
  const [searchHit, setSearchHit] = useState(false)
  const audioURI = useSelector(selectAudioURI)
  const primaryColour = useSelector(selectAccentColour)




  //console.log(allYTData.length)

  
  //useEffect(() => {
  //  searchForVideos()
  //}, [searchTypes])

  useEffect(() => {
    if (searchText == ''){
      setSearchOn(false)
    }

    
  }, [searchText])

  


  useEffect(() => {
    var docRef = db.collection("searchRecord").doc(auth.currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        
        setRecordList(doc.data().recordList)
        setCreateNewRecord(false)
        
      } else {
         setRecordList([])
         setCreateNewRecord(true)
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });


    function addToReccomendeds(){

      if (!createNewRecord){

        
         if (searchType != 'Video Link') {
          db.collection('searchRecord')
            .doc(auth.currentUser.uid)
            .update({
                recordList:[...recordList, searchText] 
            })
        }
        
      } else {
          if (searchType != "Video Link") {
          db.collection('searchRecord')
            .doc(auth.currentUser.uid)
            .set({
                recordList:[searchText] 
            })
        }
        
      }
      
    }


    if (searchText != ""){
      addToReccomendeds()
    }
    
  }, [searchHit])

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


    if (searchOn == true){
      searchForVideos()
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
      color: "#0b9665"
    },
    {
      name: "Rock",
      color: "#ad830e"
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
      color: "#e0501b"
    },
    {
      name: "Rap/Hip Hop",
      color: "#730e0e"
    },
    {
      name: "Rhythm and blues",
      color: "#55cfd4"
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
    setSearchHit(!searchHit)
    console.log(searchType)
    if (searchType == "Playlists"){
      Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText}&type=playlist&key=${API_KEY}`)
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
      
      
      Axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText}&type=channel&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
        
      
    }
    else if (searchType == 'Music') {
      Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText + 'lyrics'}&type=video&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
    } else {
      Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchText}&type=video&key=${API_KEY}`)
      .then(res => {
        const ytData = res.data.items;
        setYTData(ytData)
      })
    }

    setSearchOn(true)
    
  }

 

  async function getPlayListData(item, playlistId){
   

    
    const response = await Axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`)
    const playlistVideos = response.data.items
    const videoId = playlistVideos[0].snippet.resourceId.videoId
    const videoThumbNail = playlistVideos[0].snippet.thumbnails.high.url
    const videoTitle = playlistVideos[0].snippet.title
    //setCurrentPlaylistData(playlistVideos)
    navigation.navigate("AlbumScreen", {title:videoTitle, photoAlbum: videoThumbNail, playlistVideos: playlistVideos, isCustom: false, searchedVideo: true, isPlaylist: true, channelId: item.snippet.channelId })
    

  }

  async function getChannelData(item, channelId){
    console.warn(channelId)
    const response = await Axios.get(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20`)
    const channelVideos = response.data.items
    //setCurrentPlaylistData(channelVideos)
    navigation.navigate("ChannelScreen", {title:item.snippet.title, photoAlbum: item.snippet.thumbnails.high.url, playlistVideos: channelVideos, isCustom: false, searchedVideo: true, channelId: item.snippet.channelId })
  }


  function searchForType(item, playlistId){

    if (searchType == "Playlists"){
      getPlayListData(item, playlistId)
    }
    else if (searchType == "Video Link"){
      navigation.navigate('VideoScreen', {videoId: item.id,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, downloadData: 'VideoLink',  Search: true, channelId: item.snippet.channelId })
        
    }
    else if (searchType ==  "Channel"){
      
      getChannelData(item, playlistId)
    }
    else {
      
      navigation.navigate('VideoScreen', {rId: item.id, videoId: item.id.videoId,  videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, artist: item.snippet.channelTitle, Search: true, downloadData: allYTData, isRecently: false, channelId: item.snippet.channelId })
    }
  }


  function renderSearches(){
    
    if (searchOn){
      if (searchType == 'Channel'){
        return (
          <FlatList
            data={allYTData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => searchForType(item, item.snippet.channelId)}>
                <Artist isSearch={false} name={item.snippet.title} photo={item.snippet.thumbnails.high.url}></Artist>
              </TouchableOpacity>
              
            )}
          ></FlatList>
        )

      }
      if (allYTData.length == 0){
        return (
            <View>
              <AlbumMessager>No results found</AlbumMessager>
            </View>
        )
      }
      return (
        <FlatList
          data={allYTData}
          keyExtractor={(item) => item.etag}
          key={'_'}
          renderItem={({ item }) => (
                    <LineItemSong
                //active={song === track.title}
                //downloaded={downloaded}
                navigation={navigation}
                imageUri={item.snippet.thumbnails.high.url}
                key={item.id}
                onPress={() => searchForType(item, item.id.playlistId)}
                songData={{
                  album: item.snippet.title,
                  artist: item.snippet.channelTitle,
                  image: item.snippet.thumbnails.high.url,
                  length: 32919,
                  title: item.snippet.title
                }}
              />
          
            
          )}
        ></FlatList>
      )
    }
    return (
      <>
      <FlatList
          data={allGenres}
          key={'#'}
          numColumns={2}
          ListHeaderComponent={<Title>Browse All</Title>}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
              <GenreMusic name={item.name} color={item.color} navigationFunc={() => navigation.navigate('TopicContent', {topic: item.name, color: item.color})} />
           
          )}
        />
        </>
  
    )
  }

  

  return (
    <ImageBackground style={styles.image} source={BG_IMAGE                                                                                                                                                                                                                                                                                                                                                                                                                                 }>
    <View style={styles.containerLinear}>
    <LinearGradient fill={primaryColour} isVideo={false}/>
    
    </View>
    <Container playerOn={audioURI == null ? false : true}>
    
      <Title   search={true}>
        Search
      </Title>

    <TextInput 
    style={{
    flexDirection: "row", 
    alignItems: 'center', 
    
    
    fontSize: 15,
    fontWeight: 'bold',
    fontStyle: 'normal',
    justifyContent: 'space-evenly', 
    backgroundColor: "#2a2a2b", 
    color: "white",
    height: 45, 
    width: "94%", 
    borderRadius: 15, 
    marginLeft: "3%",
    paddingLeft: 15,
  }}
    placeholder={placeholder}
    placeholderTextColor={"#adacb0"}
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
                        marginTop: 15
                    }}
                    renderItem={({ item, index }) => (
                        <TextButton
                            label={item.name}
                            onPress={() => setSearchType(item.name)}
                            contentContainerStyle={{
                                paddingVertical: 8,
                                paddingHorizontal: 14,
                                marginLeft: index == 0 ? 14 : 12,
                                marginRight: index == searchTypes.length - 1 ? 14 : 0,
                                borderRadius: 60,
                                height: 40,
                                //height: "45%",
                                //shadowOffset: { height: 8, width: 0 },
                              //shadowOpacity: 1.8,
                              shadowRadius: 18,
                                
                                backgroundColor: searchType == item.name ? '#06378c' : "#1d1e1f"
                            }}
                            labelStyle={{
                                color:  "#e1e1e3",
                                fontSize: 16, lineHeight: 22 
                            }}
                        />
                    )}
                />

    
      </View>
      
      <View>
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
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex:  0,
    
  },
 
});

