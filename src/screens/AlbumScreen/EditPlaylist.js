import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SECONDARY_BG } from '../../services/backgroundImage';
import { auth, db } from '../../../services/firebase';
import { Feather } from '@expo/vector-icons' 
import {colors, device, func, gStyle} from '../MusicPlayer/constants'
import TouchIcon from "../MusicPlayer/TouchIcon";
import { COLORS, FONTS, SIZES, icons, images } from '../Authentication/constants';
import { TextButton } from '../ProfileScreen/ProfileComponents';
import firebase from 'firebase';

export default function EditPlaylist(props){
  // Destructure the props
  const {playlistPhoto, playListName, playlistId} = props.route.params;

  const [currentPlayListName, setPlayListName] = useState(playListName)
  const [currentPlaylistPhoto, setPlaylistPhoto] = useState(playlistPhoto)

  async function updatePlaylistPhoto(){
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1.7, 1],
        quality: 1,
        
    });
    
    if (!result.canceled) {
        
        const image = result.assets[0].uri;
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
        setPlaylistPhoto(downloadURL)
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
    <ImageBackground style={styles.bgImage} source={SECONDARY_BG}>
            <View style={styles.header}>
                <TouchIcon
                    icon={<Feather color={colors.white} name="chevron-left" />}
                    onPress={() => props.navigation.goBack()}
                />

            </View>

            <View style={styles.container}>
                <TouchableOpacity style={{marginBottom: "15%"}} onPress={updatePlaylistPhoto}>
                        <View  style={styles.containerImage}>
                        <Image source={{uri: currentPlaylistPhoto}} style={styles.image} />
                        <Image
                                        source={icons.camera}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                        }}
                                    />
                    </View>
                </TouchableOpacity>

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
                    height: 55, 
                    width: "75%", 
                    borderRadius: 15, 
                    
                    paddingLeft: 15,
                }}
                    placeholder={"Change Playlist Name"}
                    placeholderTextColor={"#adacb0"}
                    onChangeText={(text) => setPlayListName(text)}
                    value={currentPlayListName}
                    //onSubmitEditing={updatePlaylistTitle}
                    
                    ></TextInput>
                <View style={{marginTop: '15%'}}>
                    <TextButton
                    contentContainerStyle={{
                        height: 55,
                        width: "60%",
                        marginop: 30,
                        borderRadius: 15,
                        backgroundColor: "#054c85",
                        marginBottom: "15%",
                        //marginLeft: 20,
                        //marginRight: 20
                    }}
                    label={"Submit Changes"}
                    labelStyle={{paddingHorizontal: 20}}
                    onPress={updatePlaylistTitle}
                    disabled={currentPlayListName == ''}
                    
                />
                </View>
            
           
            </View>
    
      
  </ImageBackground>
  )
  
};

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        justifyContent: "center"
      },
      header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: device.iPhoneNotch ? 48 : 24,
        position: 'absolute',
        top: 0,
        width: '200%',
       
      },
      containerSafeArea: {
        ...gStyle.containerAbsolute,
        backgroundColor: colors.blackBlur
      },
      containerButton: {
        ...gStyle.flexCenter,
        ...gStyle.spacer6,
        backgroundColor: "#1e0db5",
        borderRadius: 30,
        marginHorizontal: 20,
        marginBottom: 10
      },
      buttonText: {
        color: colors.white,
        fontSize: 18,
        
        
      },
      transparent: {
        backgroundColor: 'transparent'
      },
      container: {
        alignItems: 'center',
        paddingTop: device.iPhoneNotch ? 94 : 50,
        marginBottom: "30%"
      },
      containerImage: {
        shadowColor: colors.black,
        shadowOffset: { height: 8, width: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6
      },
      image: {
        height: 180,
        marginBottom: 16,
        width: 180,
        borderRadius: 20
      },
      title: {
        color: colors.white,
        //fontFamily: fonts.spotifyBold,
        fontSize: 20,
        marginBottom: 8,
        paddingHorizontal: 24,
        textAlign: 'center'
      },
      albumInfo: {
        color: colors.greyInactive,
        //fontFamily: fonts.spotifyRegular,
        fontSize: 12,
        marginBottom: 48
      }
  
})