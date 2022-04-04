import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Container, Title } from './styles';

export default function GenreMusic({ name, color, navigationFunc }) {
  return (
  
    <Container color={color}>
      <TouchableOpacity onPress={navigationFunc}>
      <Title>{name}</Title>
      </TouchableOpacity>
    </Container>
    
  );
}
