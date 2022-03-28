import React from "react";
import { View, Image, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";


const SongListItem = ({ id, title, artist, imageUri, navigationFunc, item }) => {
  //const { setSongId } = useAppContext();

  return (
    <TouchableOpacity onPress={() => navigationFunc(item)}>
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.artist}>{artist}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SongListItem;

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      margin: 15
    },
    image: {
      width: 75,
      height: 75,
    },
    innerContainer: {
      justifyContent: "space-around",
      marginLeft: 15
    },
    title: {
      color: "white",
      fontSize: 15
    },
    artist: {
      color: "lightgray",
      fontSize: 13
    },
  });