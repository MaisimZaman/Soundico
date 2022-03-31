import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";



const AlbumHeader = ({ name, creator, imageUri, likes, firstItem, musicNavigator }) => (
  <View style={styles.container}>
    <Image source={{ uri: imageUri }} style={styles.image} />
    <Text style={styles.name}>{name}</Text>
    <View style={styles.innerContainer}>
      <Text style={styles.creator}>By {creator}</Text>
      <Text style={styles.likes}>{likes} Likes</Text>
    </View>
    <TouchableOpacity onPress={() => musicNavigator(firstItem)}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>PLAY</Text>
      </View>
    </TouchableOpacity>
  </View>
);

export default AlbumHeader;

const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      padding: 20,
    },
    image: {
      width: 185,
      height: 185,
      margin: 15,
    },
    innerContainer: {
      flexDirection: "row",
      margin: 5,
    },
    name: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
    creator: {
      color: "lightgray",
      fontSize: 16,
      margin: 5,
    },
    likes: {
      color: "lightgray",
      fontSize: 16,
      margin: 5,
    },
    button: {
      backgroundColor: "#032596",
      height: 60,
      width: 175,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 20,
    },
  });