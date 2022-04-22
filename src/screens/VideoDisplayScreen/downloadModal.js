import {  Text, View,  Modal,  Pressable} from 'react-native'
import React, {useState, useEffect, useRef} from 'react';

import {  downloadAudioOrVideo  } from './handlingfunctions';

import { styles } from './styles';
// components
export default function RenderModal({modalVisible, setModalVisible, isPlaylist, currentVideoID, props}){
        
    function renderPlaylistDownload(){
        return (
            <Pressable
                  style={[styles.button4, styles.buttonClose]}
                  onPress={savePlaylistData}>
                  <Text style={styles.textStyle}>Download Playlist</Text>
            </Pressable>
        )
    }
    return (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>How would you like to download it?</Text>
                <Pressable
                  style={[styles.button1, styles.buttonClose]}
                  onPress={() => downloadAudioOrVideo(true)}>
                  <Text style={styles.textStyle}>Download as Video</Text>
                </Pressable>
                <Pressable
                  style={[styles.button2, styles.buttonClose]}
                  onPress={() => downloadAudioOrVideo(false, props=props, currentVideoID=currentVideoID)}>
                  <Text style={styles.textStyle}>Download Music Audio only</Text>
                </Pressable>
                <Pressable
                  style={[styles.button2, styles.buttonClose]}
                  onPress={() => downloadAudioOrVideo(false, true)}>
                  <Text style={styles.textStyle}>Download as Podcast Audio</Text>
                </Pressable>
                {isPlaylist ? renderPlaylistDownload() : null}
                <Pressable
                  style={[styles.button3, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                
              </View>
            </View>
          </Modal> 
          
        </View>
      );
}