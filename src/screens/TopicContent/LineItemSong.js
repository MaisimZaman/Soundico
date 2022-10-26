import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, gStyle } from '../MusicPlayer/constants/index';

const LineItemSong = ({ active=false, downloaded=false, onPress, songData, imageUri, navigation }) => {
  const activeColor = active ? colors.brandPrimary : colors.white;

  return (
    <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={{width: 80, height: 60, borderRadius: 10, marginRight: "10%"}} />
      <TouchableOpacity
        activeOpacity={gStyle.activeOpacity}
        onPress={onPress}
        style={gStyle.flex5}
      >
          
          
          <Text style={[styles.title, { color: activeColor }]}>
            {songData.title}
            </Text>
            <View style={gStyle.flexRow}>
            {downloaded && (
                <View style={styles.circleDownloaded}>
                <Ionicons color={colors.blackBg} name="arrow-down" size={14} />
                </View>
            )}
            <Text style={styles.artist}>{songData.artist}</Text>
            </View>
        </TouchableOpacity>

        <View style={styles.containerRight}>
            <Feather onPress={() => navigation.navigate('MoreOptions', {
            albumTitle: songData.title,
            albumCover: imageUri,
            albumArtist: songData.artist,
            //setDownloadProcessing: setDownloadProcessing,
            //downloadProcessing: downloadProcessing,
            //isPlaylist: isPlaylist,
            //saveAudioData: saveAudioData,
            //saveAudioPodCastData: saveAudioPodCastData,
            //currentVideoID: currentVideoID[1],
            //saveVideoData: saveVideoData,
            //savePlaylistData: savePlaylistData,
            //handleNavigteToChannel: handleNavigteToChannel,
            //currentAudioURI: playingVideo
          })} color={colors.greyLight} name="more-horizontal" size={20} />
        </View>
            
      
      
    </View>
  );
};

LineItemSong.defaultProps = {
  active: false,
  downloaded: false
};

LineItemSong.propTypes = {
  // required
  onPress: PropTypes.func.isRequired,
  songData: PropTypes.shape({
    album: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,

  // optional
  active: PropTypes.bool,
  downloaded: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    width: '100%',
    flexDirection: "row",
  },
  innerContainer: {
    justifyContent: "space-around",
    marginLeft: 15
  },
  title: {
    ...gStyle.textSpotify16,
    color: colors.white,
    marginBottom: 4
  },
  circleDownloaded: {
    alignItems: 'center',
    backgroundColor: colors.brandPrimary,
    borderRadius: 7,
    height: 14,
    justifyContent: 'center',
    marginRight: 8,
    width: 14
  },
  artist: {
    ...gStyle.textSpotify12,
    color: colors.greyInactive
  },
  containerRight: {
    alignItems: 'flex-end',
    flex: 1
  }
});

export default LineItemSong;