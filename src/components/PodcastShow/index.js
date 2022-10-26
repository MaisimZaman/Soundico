import React from 'react';

import {
  Container,
  Image,
  InformationContainer,
  ChanelPodcastName,
} from './styles';




export default function PodcastShow({ photoAlbum, name, isSearch }) {
  return (
    <Container >
      <Image
      isSearch={isSearch}
        source={{
          uri: photoAlbum,
        }}
      />
      <InformationContainer>
        <ChanelPodcastName>{name}</ChanelPodcastName>
      </InformationContainer>
    </Container>
  );
}
