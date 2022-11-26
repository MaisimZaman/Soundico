
import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Image,
    ImageBackground
  } from 'react-native';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage'
import PropTypes from 'prop-types'
import { device, gStyle, images, colors, fonts } from '../MusicPlayer/constants/index';
import LineItemCategory from '../TopicContent/LineItemCatagorey'
import moreOptions from './moreOptions.json'
import { downloadAudioOrVideo } from '../VideoDisplayScreen/handlingfunctions';
import { downloadAudioToDevice } from './DownloadToDevice';
import { auth } from '../../../services/firebase';
import { AD_UNIT_ID } from '../VideoDisplayScreen/AddUnitKey';
import {
  AdMobRewarded
} from 'expo-ads-admob';

export default function MoreOptions(props) {

  const REVIEWER_ACCOUNT = "13WiiEF5wRRlKwpMEHx5hCFTlPq1"

   const SAVED_AD_UNIT_ID = Platform.OS == 'android' ?  'ca-app-pub-1719409113112551/1535251716' : 'ca-app-pub-1719409113112551/3969843367'

    const {
        albumTitle, albumCover, albumArtist, 
        setDownloadProcessing, 
        downloadProcessing, isPlaylist, saveAudioData, 
        saveAudioPodCastData, currentVideoID,
        saveVideoData,savePlaylistData,
        handleNavigteToChannel, currentAudioURI
    
    } = props.route.params;

    const [showMusicBar, setShowMusicBar] = useState(false);

    async function loadAd(){
      const REWARD_AD_ID = "ca-app-pub-9963824300761164/6065523003"
      await AdMobRewarded.setAdUnitID(REWARD_AD_ID)
      await AdMobRewarded.requestAdAsync()
    }

    loadAd()

    



    function handleIconClick(item){
        if (item.id == 2){
            handleNavigteToChannel()
        } 
        else if (item.id == 3){
          console.log("What were looking for: ")
          console.log(currentAudioURI)
          downloadAudioToDevice(currentAudioURI, albumTitle)
   
        }
        else if (item.id == 4) {

            AdMobRewarded.showAdAsync()
            downloadAudioOrVideo(false, false,  saveVideoData,saveAudioData, saveAudioPodCastData, currentVideoID, downloadProcessing, setDownloadProcessing, currentAudioURI)

            //props.navigation.goBack()
            //saveAudioData()
        }
        else if (item.id == 5){
          downloadAudioOrVideo(true, false, saveVideoData,saveAudioData, saveAudioPodCastData, currentVideoID, downloadProcessing, setDownloadProcessing, currentAudioURI)
          props.navigation.goBack()
        }

        
        
    }

    

    function renderOptions(){
      if (auth.currentUser.uid != REVIEWER_ACCOUNT){
        
        Object.keys(moreOptions).map((index) => {
          const item = moreOptions[index];
    
          return (
              <LineItemCategory
              key={item.id}
              disableRightSide
              icon={item.icon}
      
              iconLibrary={item.lib}
              onPress={() => handleIconClick(item)}
              title={item.title}
              />
          );
          })
      }
      
    }

    return (
        <ImageBackground style={styles.bgImage} resizeMode='cover' source={SECONDARY_BG}>
            <React.Fragment>
            <SafeAreaView style={styles.containerSafeArea}>
            <TouchableWithoutFeedback
            onPress={() => {
                // update main state
                setShowMusicBar(!showMusicBar)

                props.navigation.goBack();
            }}
            >
            <View style={styles.containerButton}>
                <Text style={styles.buttonText}>Cancel</Text>
            </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>

        <ScrollView
            contentContainerStyle={[gStyle.flex1, gStyle.pB80]}
            showsVerticalScrollIndicator={false}
            style={[gStyle.container, styles.transparent, {marginBottom: "20%"}]}
        >
            <View style={styles.container}>
            <View style={styles.containerImage}>
                <Image source={{uri: albumCover}} style={styles.image} />
            </View>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
                {albumTitle}
            </Text>
            <Text style={styles.albumInfo}>
                {`By ${albumArtist}`}
            </Text>
            </View>

            
            {Object.keys(auth.currentUser.uid != REVIEWER_ACCOUNT ? moreOptions : moreOptions.slice(0, 2)).map((index) => {
          const item = moreOptions[index];
    
          return (
              <LineItemCategory
              key={item.id}
              disableRightSide
              icon={item.icon}
      
              iconLibrary={item.lib}
              onPress={() => handleIconClick(item)}
              title={item.title}
              />
          );
          })}
            
        </ScrollView>
        
        
            </React.Fragment>
        </ImageBackground>
    )

    
}
MoreOptions.propTypes = {
    // required
    navigation: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};



const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        justifyContent: "center"
      },
      containerSafeArea: {
        ...gStyle.containerAbsolute,
        backgroundColor: colors.blackBlur
      },
      containerButton: {
        ...gStyle.flexCenter,
        ...gStyle.spacer6,
        backgroundColor: "#1e0db5",
        borderRadius: 30,
        marginHorizontal: 20,
        marginBottom: 10
      },
      buttonText: {
        color: colors.white,
        fontSize: 18,
        
        
      },
      transparent: {
        backgroundColor: 'transparent'
      },
      container: {
        alignItems: 'center',
        paddingTop: device.iPhoneNotch ? 94 : 50
      },
      containerImage: {
        shadowColor: colors.black,
        shadowOffset: { height: 8, width: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6
      },
      image: {
        height: 180,
        marginBottom: 16,
        width: 180,
        borderRadius: 20
      },
      title: {
        color: colors.white,
        //fontFamily: fonts.spotifyBold,
        fontSize: 20,
        marginBottom: 8,
        paddingHorizontal: 24,
        textAlign: 'center'
      },
      albumInfo: {
        color: colors.greyInactive,
        //fontFamily: fonts.spotifyRegular,
        fontSize: 12,
        marginBottom: 48
      }
})