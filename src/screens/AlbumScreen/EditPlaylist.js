import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SECONDARY_BG } from '../../services/backgroundImage';
import { auth, db } from '../../../services/firebase';
import firebase from 'firebase';

export default function EditPlaylist(props){
  // Destructure the props
  const {playlistPhoto, playListName, playlistId} = props.route.params;

  const  [currentPlayListName, setPlayListName] = useState(playListName)

  async function updatePlaylistPhoto(){
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1.7, 1],
        quality: 1,
        
    });
    
    if (!result.canceled) {
        const image = result.url;
        const uri = image;
        const childPath = `custom-playlist-images/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
            
            saveImageData(snapshot);
            console.log(snapshot)
        })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }


    function saveImageData(downloadURL){

        db.collection("playlists")
                .doc(auth.currentUser.uid)
                .collection("userPlaylists")
                .doc(playlistId)
                .update({
                    playListThumbnail: downloadURL,
                    
                })


    }
  }

  function updatePlaylistTitle(){
    db.collection("playlists")
        .doc(auth.currentUser.uid)
        .collection("userPlaylists")
        .doc(playlistId)
        .update({
            playlistTitle: currentPlayListName,
            
        })
    props.navigation.goBack()
  }

  

  

  return (
    <ImageBackground style={styles.Bgimage} source={SECONDARY_BG}>

    
      
  </ImageBackground>
  )
  
};

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        justifyContent: "center"
      },
  
})