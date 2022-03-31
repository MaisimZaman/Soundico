import React from 'react';

import { BottomTabBar } from '@react-navigation/bottom-tabs';

import Player from '../../components/Player';
import { useSelector } from 'react-redux';
import { selectAudioURI } from '../../../services/slices/navSlice';

export default function CustomTabBar(props) {
  audioExists = useSelector(selectAudioURI)
  function renderPlayer(){
    if (audioExists != null){
      return (
        <Player  navigation={props.navigation}/>
      )
    }

  }
  return (
    <>
      {renderPlayer()}
      <BottomTabBar {...props} />
    </>
  );
}
