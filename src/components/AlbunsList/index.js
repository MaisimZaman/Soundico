import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Container, Image, AlbumInformation, Title } from './styles';
import {Dimensions} from 'react-native';
const window = Dimensions.get('window');

const D = {width: window.width, height: window.height};

export default function AlbunsList({
  name,
  photoAlbum,
  recentPlayed = false,
  podcast = false,
  channel = false
}) {

  const styles = StyleSheet.create({
    container: {
        margin: 8,
        marginLeft: 10
    },
  
    album: {
        width: D.width * (channel ? 4.2/13.5 : 4.2/11),
        height: D.width *   4.2/14,
        backgroundColor: 'white'
    },
  
    img: {
        flex: 1,
        height: null,
        width: null
    },
  
    text: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 8,
        flex: 1,
        flexWrap: 'wrap'
    },
  
    followers: {
        fontSize: 8,
        color: 'gray',
        alignSelf: 'center',
        fontWeight: '600',
        marginTop: 4
    }
  
  });

  function renderSpacedString(title){

    var title = title
    
    if (title.length > 20){
      const result = title.slice(0, 20) + '\n' + title.slice(20);
      return result
      
    }

    

    return title
  }




 
 

  return (
    <View style={styles.container}>
            <Image channel={channel} source={{uri: photoAlbum}} style={[styles.album]} />

            <Text style={styles.text}>{renderSpacedString(name.slice(0, 40))}</Text>
          

    </View>
  )

  
  
  


  
  
}

