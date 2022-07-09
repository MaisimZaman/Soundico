import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import LinearGradient from '../../screens/TopicContent/LinearGradient'
import { Container, Title } from './styles';

export default function GenreMusic({ name, color, navigationFunc }) {
  return (
  
    <Container color={color}>
      <TouchableOpacity onPress={navigationFunc}>
      <Title>{name}</Title>
      </TouchableOpacity>
      <LinearGradient rounded={true} fill={color} height={95} />
      
    </Container>
    
  );
}
