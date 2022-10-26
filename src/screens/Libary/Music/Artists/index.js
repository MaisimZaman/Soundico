import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import Artist from '../../../../components/Artist';
import api from '../../../../services/api';

import { Container } from './styles';

export default function Artists() {
  ///const [artists, setArtists] = useState([]);

  const artists = [
    {
      name: "elon Musk",
      photo: 'https://img.etimg.com/thumb/msid-84588036,width-650,imgsize-109325,,resizemode-4,quality-100/elon-musk.jpg'
    },
  ]

  

  return (
    <Container>
      <FlatList
        data={artists}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <Artist name={item.name} photo={item.photo} />
        )}
      />
    </Container>
  );
}
