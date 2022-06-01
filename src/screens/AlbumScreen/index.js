import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "../../../services/firebase";
import { BG_IMAGE } from "../../services/backgroundImage";

import AlbumHeader from "./components/AlbumHeader";
import SongListItem from "./components/songListItem";

import ModalHeader from "../MusicPlayer/ModalHeader";

import { Feather } from '@expo/vector-icons' 
import {colors} from '../MusicPlayer/constants'



function AlbumScreen(props){
  const {title, photoAlbum,playlistVideos, isCustom, searchedVideo} = props.route.params
  const [albums, setAlbums] = useState(playlistVideos);

 function navigateToMusicPlayer(item){

    if (isCustom){
      props.navigation.navigate("MusicScreen", 
      {
      thumbNail:item.data.thumbNail,
      audioURI: item.data.audio,
      title: item.data.title,
      audioID: item.id,
      downloadData: albums,
      playListName: title,
      

      })

    }
    else {
      props.navigation.navigate('VideoScreen', { 
      rId: item.id, 
      videoId: searchedVideo ? item.id.videoId :  item.snippet.resourceId.videoId, 
      videoThumbNail:item ? item.snippet.thumbnails.high.url : item.data.thumbNail, 
      videoTitle: item.snippet.title, 
      artist: searchedVideo ?  item.snippet.channelTitle : item.data.channelTitle, 
      Search: false, 
      isRecently: false, 
      downloadData: albums
    })
     

    }
    

    
  }


  return (
    <ImageBackground style={styles.image} source={ BG_IMAGE}>
      <ModalHeader
          left={<Feather color={colors.greyLight} name="chevron-down" />}
          leftPress={() => props.navigation.goBack()}
          right={ <Feather onPress={() => props.navigation.navigate('PlayListOptions', {
            title: title, 
            photoAlbum: photoAlbum,
            playlistVideos: playlistVideos, 
            isCustom: isCustom, 
           
          })} color={colors.greyLight} name="more-horizontal" />}
          text={title}
        />
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <SongListItem
              id={item.id}
              title={isCustom ? item.data.title : item.snippet.title}
              artist={isCustom ? item.data.channelTitle:  item.snippet.channelTitle}
              imageUri={isCustom ? item.data.thumbNail : item.snippet.thumbnails.high.url}
              navigationFunc={navigateToMusicPlayer}
              item={item}
              uri={"null"}
            />
        )}
        ListHeaderComponent={
          <AlbumHeader
            id={21}
            imageUri={photoAlbum}
            creator={auth.currentUser.displayName}
            name={title}
            firstItem = {playlistVideos[0]}
            musicNavigator={navigateToMusicPlayer}
            artistHeadline={"First album"}
            likes={900}
            searchedVideo={searchedVideo}
          />
        }
      />
    </ImageBackground>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center"
  },
})