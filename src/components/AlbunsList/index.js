import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { Container, Image, AlbumInformation, Title } from './styles';

export default function AlbunsList({
  name,
  photoAlbum,
  recentPlayed = false,
  podcast = false,
}) {

  
  
  return (
    <Container recentPlayed={recentPlayed}>
     <View>
      <Image  source={{ uri: photoAlbum }} />
      </View>

      <AlbumInformation>
      {!podcast && <FontAwesome name="random" size={15} color="#acacac" />}
    
       
        <Title podcast={podcast}>{name.length <= 17 ? name :  `${name.slice(0, 40)}________________`}</Title>
        
      
        </AlbumInformation>
      
    </Container>
  );
}
