import React from 'react';

import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';

import {
  Container,
  Image,
  InformationContainer,
  TitlePlaylist,
} from './styles';

export default function Playlist({ name, photoAlbum, create = false,backgroundColor='null' }) {
  return (
<View style={{backgroundColor: backgroundColor}}>
    <Container>
      <Image
        source={{
          uri: photoAlbum,
        }}
      />
      <InformationContainer>
        <TitlePlaylist>{name}</TitlePlaylist>
        {!create && <FontAwesome name="random" size={13} color="#acacac" />}
      </InformationContainer>
    </Container>
    </View>
  );
}
