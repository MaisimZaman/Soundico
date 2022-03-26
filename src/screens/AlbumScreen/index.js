import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ImageBackground, StyleSheet } from "react-native";
import { auth } from "../../../services/firebase";
import { BG_IMAGE } from "../../services/backgroundImage";

import AlbumHeader from "./components/AlbumHeader";
import SongListItem from "./components/songListItem";


const AlbumScreen = (props) => {
  const {title, photoAlbum,playlistVideos} = props.route.params
  const [albums, setAlbums] = useState(playlistVideos);


  return (
    <ImageBackground style={styles.image} source={{uri: BG_IMAGE}}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongListItem
            id={item.id}
            title={item.snippet.title}
            artist={item.snippet.channelTitle}
            imageUri={item.snippet.thumbnails.high.url}
            uri={"null"}
          />
        )}
        ListHeaderComponent={
          <AlbumHeader
            id={21}
            imageUri={photoAlbum}
            creator={auth.currentUser.displayName}
            name={title}
            artistHeadline={"First album"}
            likes={900}
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