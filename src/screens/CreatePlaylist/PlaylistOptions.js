import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native'
import React from 'react'
import { BG_IMAGE } from '../../services/backgroundImage'

export default function PlaylistOptions(props) {

  const {title, photoAlbum,playlistVideos, isCustom} = props.route.params;


  
  return (
    <ImageBackground style={styles.bgImage} source={ BG_IMAGE}>
      <View style={styles.container}>
      
      <Image source={{ uri: photoAlbum }} style={styles.image} />
      <Text style={styles.name}>{title}</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.creator}>By {"me"}</Text>
        <Text style={styles.likes}>{21} Likes</Text>
      </View>
      
    </View>
    </ImageBackground>
  )
}




const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        justifyContent: "center"
      },
      container: {
        alignItems: "center",
        padding: 20,
      },
      image: {
        width: 200,
        height: 200,
        margin: 15,
        borderRadius:   18
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

})