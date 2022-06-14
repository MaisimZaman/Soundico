import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ImageBackground, StyleSheet, TouchableOpacity, Animated, Switch, Image } from "react-native";
import { auth } from "../../../services/firebase";
import { BG_IMAGE } from "../../services/backgroundImage";
import PropTypes from 'prop-types';
import AlbumHeader from "./components/AlbumHeader";
import SongListItem from "./components/songListItem";

import ModalHeader from "../MusicPlayer/ModalHeader";

import { Feather } from '@expo/vector-icons' 
import {colors, device, func, gStyle} from '../MusicPlayer/constants'
import { BlurView } from 'expo-blur';

import LinearGradient from '../TopicContent/LinearGradient'
import LineItemSong from "../TopicContent/LineItemSong";
import TouchText from "../TopicContent/TouchText";
import TouchIcon from "../MusicPlayer/TouchIcon";






export default function ChannelScreen(props){
  const {title, photoAlbum,playlistVideos, isCustom, searchedVideo} = props.route.params
  const [albums, setAlbums] = useState(playlistVideos);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [showMusicBar, setShowMuiscBar] = useState(true)

  const stickyArray = device.web ? [] : [0];
    const headingRange = device.web ? [140, 200] : [230, 280];
    const shuffleRange = device.web ? [40, 80] : [40, 80];

    const opacityHeading = scrollY.interpolate({
      inputRange: headingRange,
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const opacityShuffle = scrollY.interpolate({
      inputRange: shuffleRange,
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    function shufflePlay(){
      const randomTrack = Math.floor(Math.random() * albums.length);


      if (isCustom){
        props.navigation.navigate('MusicScreen', 
                {
                  thumbNail:albums[randomTrack].data.thumbNail,
                  audioURI: albums[randomTrack].data.audio,
                  title: albums[randomTrack].data.title,
                  audioID: albums[randomTrack].id,
                  downloadData: albums,
                  playListName: title,
     })
      } else {
        props.navigation.navigate('VideoScreen', 
                {
                  rId: albums[randomTrack].id, 
                  videoId: albums[randomTrack].id.videoId,  
                  videoThumbNail:albums[randomTrack].snippet.thumbnails.high.url, 
                  videoTitle: albums[randomTrack].snippet.title, 
                  artist: albums[randomTrack].snippet.channelTitle, 
                  Search: false, 
                  downloadData: albums, 
                  isRecently: false })
      }

      

      
    }

 function navigateToMusicPlayer(item){

    if (isCustom){
      props.navigation.navigate("MusicScreen", 
      {
      thumbNail:item.data.thumbNail,
      audioURI: item.data.audio,
      title: item.data.title,
      audioID: item.id,
      downloadData: albums,
      playListName: title,
      

      })

    }
    else {
      props.navigation.navigate('VideoScreen', { 
      rId: item.id, 
      videoId: !isCustom ? item.id.videoId :  item.snippet.resourceId.videoId, 
      videoThumbNail:!isCustom ? item.snippet.thumbnails.high.url : item.data.thumbNail, 
      videoTitle: item.snippet.title, 
      artist: !isCustom ?  item.snippet.channelTitle : item.data.channelTitle, 
      Search: false, 
      isRecently: false, 
      downloadData: albums
    })
     

    }
    

    
  }

  return (
        
    <View 
    style={gStyle.container}
    >
{showMusicBar === false && (
<BlurView intensity={99} style={styles.blurview} tint="dark" />
)}

<View style={styles.containerHeader}>
<Animated.View
  style={[styles.headerLinear, { opacity: opacityHeading }]}
>
<LinearGradient fill={"#555f66"} height={89} />
</Animated.View>
<View style={styles.header}>
  <TouchIcon
    icon={<Feather color={colors.white} name="chevron-left" />}
    onPress={() => props.navigation.goBack()}
  />
  <Animated.View 
  style={{ opacity: opacityShuffle }}
  >
    <Text style={styles.headerTitle}>{title}</Text>
  </Animated.View>
  <TouchIcon
    icon={<Feather color={colors.white} name="more-horizontal" />}
    
  />
</View>
</View>

<View style={styles.containerFixed}>
<View style={styles.containerLinear}>
<LinearGradient fill={"#555f66"} />
</View>
<View style={styles.containerImage}>
<Image source={{uri: photoAlbum}} style={styles.image} />
</View>
<View style={styles.containerTitle}>
  <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
    {title}
  </Text>
</View>
<View style={styles.containerAlbum}>
  <Text style={styles.albumInfo}>
    {`Album by ${"unknown"} · ${2009}`}
  </Text>
</View>
</View>

<Animated.ScrollView
onScroll={Animated.event(
  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
  { useNativeDriver: true }
)}
scrollEventThrottle={16}
showsVerticalScrollIndicator={false}
stickyHeaderIndices={stickyArray}
style={styles.containerScroll}
>
<View style={styles.containerSticky}>
  <Animated.View
    style={[styles.containerStickyLinear, { opacity: opacityShuffle }]}
  >
    <LinearGradient fill={colors.black20} height={50} />
  </Animated.View>
  <View style={styles.containerShuffle}>
    <TouchText
      onPress={shufflePlay}
      style={styles.btn}
      styleText={styles.btnText}
      text="Shuffle Play"
    />
  </View>
</View>
<View style={styles.containerSongs}>
  <View style={styles.row}>
    <Text style={styles.downloadText}>
      {'Download'}
    </Text>
    <Switch
      trackColor={colors.greySwitchBorder}
      //onValueChange={(val) => onToggleDownloaded(val)}
      //value={downloaded}
    />
  </View>

  {albums &&
    albums.map((item) => (
      <LineItemSong
        //active={song === track.title}
        //downloaded={downloaded}
        imageUri={isCustom ? item.data.thumbNail : item.snippet.thumbnails.high.url}
        key={item.id}
        onPress={() => navigateToMusicPlayer(item)}
        songData={{
          album: title,
          artist: isCustom ? item.data.channelTitle:  item.snippet.channelTitle,
          image: isCustom ? item.data.thumbNail : item.snippet.thumbnails.high.url,
          length: 32919,
          title: isCustom ? item.data.title : item.snippet.title
        }}
      />
    ))}
</View>
<View style={gStyle.spacer16} />
</Animated.ScrollView>
</View>


)


  
};



const styles = StyleSheet.create({
  blurview: {
    ...StyleSheet.absoluteFill,
    zIndex: 101
  },
  containerHeader: {
    height: 89,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 100
  },
  headerLinear: {
    height: 89,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: device.iPhoneNotch ? 48 : 24,
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  headerTitle: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    marginTop: 2,
    paddingHorizontal: 8,
    textAlign: 'center',
    width: device.width - 100
  },
  containerFixed: {
    alignItems: 'center',
    paddingTop: device.iPhoneNotch ? 94 : 60,
    position: 'absolute',
    width: '100%'
  },
  containerLinear: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: device.web ? 5 : 0
  },
  containerImage: {
    shadowColor: colors.black,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    zIndex: device.web ? 20 : 0
  },
  image: {
    height: 148,
    marginBottom: device.web ? 0 : 16,
    width: 148,
    borderRadius: 100
    
  },
  containerTitle: {
    marginTop: device.web ? 8 : 0,
    zIndex: device.web ? 20 : 0
  },
  title: {
    ...gStyle.textSpotifyBold20,
    color: colors.white,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'center'
  },
  containerAlbum: {
    zIndex: device.web ? 20 : 0
  },
  albumInfo: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive,
    marginBottom: 48
  },
  containerScroll: {
    paddingTop: 89
  },
  containerSticky: {
    marginTop: device.iPhoneNotch ? 238 : 194
  },
  containerShuffle: {
    alignItems: 'center',
    height: 50,
    shadowColor: colors.blackBg,
    shadowOffset: { height: -10, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },
  containerStickyLinear: {
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  btn: {
    backgroundColor: "#13588a",
    borderRadius: 25,
    height: 50,
    width: 220
  },
  btnText: {
    ...gStyle.textSpotifyBold16,
    color: colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  containerSongs: {
    alignItems: 'center',
    backgroundColor: colors.blackBg,
    minHeight: 540
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%'
  },
  downloadText: {
    ...gStyle.textSpotifyBold18,
    color: colors.white
  },
  imageBG: {
    flex: 1,
    justifyContent: "center"
  },
})