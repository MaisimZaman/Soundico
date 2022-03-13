import React, { useState } from 'react';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {
  Container,
  BarStatus,
  Line,
  PhotoAlbum,
  Music,
  Information,
  InformationAlbum,
  TitleMusic,
  Separator,
  AuthorName,
  InformationController,
  DescriptionDevices,
  Controller,
} from './styles';

export default function Player({Title="Intersteller", Artist="Hanz Zimmer", ThumbNail="https://m.media-amazon.com/images/I/71otC8duVIL._SL1367_.jpg", navigation}) {
  const [playMusic, setPlayMusic] = useState(false);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('MusicScreen')}>
      <Container>
        <BarStatus>
          <Line />
        </BarStatus>
        <PhotoAlbum
          source={{
            uri: ThumbNail,
          }}
        />
        <Music>
          <Information>
            <InformationAlbum>
              <TitleMusic>{Title}</TitleMusic>
              <Separator> • </Separator>
              <AuthorName>{Artist}</AuthorName>
            </InformationAlbum>
            <InformationController>
              <MaterialCommunityIcons
                name="speaker-wireless"
                size={14}
                color="#FFF"
              />
              <DescriptionDevices>Available Devices</DescriptionDevices>
            </InformationController>
          </Information>
          <Controller onPress={() => setPlayMusic(!playMusic)}>
            {playMusic && (
              <MaterialCommunityIcons name="pause" size={30} color="#FFF" />
            )}
            {!playMusic && (
              <MaterialCommunityIcons name="play" size={30} color="#FFF" />
            )}
          </Controller>
        </Music>
      </Container>
    </TouchableOpacity>
  );
}
