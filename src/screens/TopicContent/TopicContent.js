import { StyleSheet, View, ImageBackground, FlatList, TouchableOpacity, Alert,
  Animated,
  Image,
  Switch,
  Text,
 } from 'react-native'
import PropTypes from 'prop-types';
import AlbunsList from '../../components/AlbunsList'
import React, {useEffect, useState} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage'
import { API_KEY } from '../Search/YoutubeApi'
import { colors, device, func, gStyle } from '../MusicPlayer/constants/index';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import LinearGradient from './LinearGradient'
import LineItemSong from './LineItemSong'
import TouchText from './TouchText'
import TouchIcon from '../MusicPlayer/TouchIcon'

import Axios from 'axios'


export default function TopicContent(props) {
    const {topic, color} = props.route.params
    const [content, setAllContent] = useState([])
    const [showMusicBar, setShowMuiscBar] = useState(true)
    const scrollY = React.useRef(new Animated.Value(0)).current;

    let cover_img = "https://thumbs.dreamstime.com/b/music-note-background-19549888.jpg"

    

    useEffect(() => {
      if (topic == 'Clasical'){
       cover_img = "https://thumbs.dreamstime.com/b/music-note-background-19549888.jpg"
      } else {
        console.warn("this is not clasical")
      }
    }, [])

    useEffect(() => {
        
        Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${topic + 'music'}&key=${API_KEY}`)
          .then(res => {
            const thisContent = res.data.items;
            setAllContent(thisContent)
            
            
        })


      
    
    }, [props.navigation])

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
          <LinearGradient fill={color} height={89} />
        </Animated.View>
        <View style={styles.header}>
          <TouchIcon
            icon={<Feather color={colors.white} name="chevron-left" />}
            onPress={() => props.navigation.goBack(null)}
          />
          <Animated.View 
          style={{ opacity: opacityShuffle }}
          >
            <Text style={styles.headerTitle}>{topic}</Text>
          </Animated.View>
          <TouchIcon
            icon={<Feather color={colors.white} name="more-horizontal" />}
            
          />
        </View>
      </View>

      <View style={styles.containerFixed}>
        <View style={styles.containerLinear}>
          <LinearGradient fill={color} />
        </View>
        <View style={styles.containerImage}>
        <Image source={{uri: cover_img}} style={styles.image} />
        </View>
        <View style={styles.containerTitle}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
            {topic}
          </Text>
        </View>
        <View style={styles.containerAlbum}>
          <Text style={styles.albumInfo}>
            {`Album by ${"Elon musk"} · ${2009}`}
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
              onPress={() => null}
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

          {content &&
            content.map((track) => (
              <LineItemSong
                //active={song === track.title}
                //downloaded={downloaded}
                imageUri={track.snippet.thumbnails.high.url}
                key={track.id.videoId}
                onPress={() => props.navigation.navigate('VideoScreen', 
                {
                  rId: track.id, 
                  videoId: track.id.videoId,  
                  videoThumbNail:track.snippet.thumbnails.high.url, 
                  videoTitle: track.snippet.title, 
                  artist: track.snippet.channelTitle, 
                  Search: false, 
                  downloadData: content, 
                  isRecently: false })}
                songData={{
                  album: topic,
                  artist: track.snippet.channelTitle,
                  image: track.snippet.thumbnails.high.url,
                  length: 32919,
                  title: track.snippet.title
                }}
              />
            ))}
        </View>
        <View style={gStyle.spacer16} />
      </Animated.ScrollView>
    </View>
       
    )
}


TopicContent.propTypes = {
  // required
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
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
    borderRadius: 20
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
    backgroundColor: colors.brandPrimary,
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
});

