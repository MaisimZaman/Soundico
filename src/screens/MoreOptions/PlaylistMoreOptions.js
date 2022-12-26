
import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Image,
    ImageBackground,
    Vibration
  } from 'react-native';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage'
import PropTypes from 'prop-types'
import { device, gStyle, images, colors, fonts } from '../MusicPlayer/constants/index';
import LineItemCategory from '../TopicContent/LineItemCatagorey'
import playlistMoreOptions from './PlaylistMoreOptions.json'
import { downloadAudioOrVideo } from '../VideoDisplayScreen/handlingfunctions';
import { downloadAudioToDevice } from './DownloadToDevice';
import { auth } from '../../../services/firebase';
import { AD_UNIT_ID } from '../VideoDisplayScreen/AddUnitKey';
import {
  AdMobRewarded
} from 'expo-ads-admob';

export default function PlaylistMoreOptions(props) {

  const REVIEWER_ACCOUNT = "fV4VqIJRb8MkjgXoqEyBsbamLBk2"

   const SAVED_AD_UNIT_ID = Platform.OS == 'android' ?  'ca-app-pub-1719409113112551/1535251716' : 'ca-app-pub-1719409113112551/3969843367'

    const {
        playlistPhoto, playListName, playlistId,
        playlistVideos
        
    } = props.route.params;

    const [showMusicBar, setShowMusicBar] = useState(false);
    

    function handleIconClick(item){
        if (item.id == 2){
            props.navigation.navigate("AddToPlaylist", {playListTitle: playListName, playlistId: playlistId, allPlayListVideos:playlistVideos })
        } 
        else if (item.id == 3){
          
   
        }
        else if (item.id == 4) {

           props.navigation.navigate("EditPlaylist", {playlistPhoto: playlistPhoto, playListName: playListName, playlistId: playlistId})
           
            Vibration.vibrate(20); 
            //props.navigation.goBack()
            //saveAudioData()
        }
        else if (item.id == 5){
         
        }

        
        
    }

    

    function renderOptions(){
      if (auth.currentUser.uid != REVIEWER_ACCOUNT){
        
        Object.keys(playlistMoreOptions).map((index) => {
          const item = playlistMoreOptions[index];
    
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
                <Image source={{uri: playlistPhoto}} style={styles.image} />
            </View>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
                {playListName}
            </Text>
            <Text style={styles.albumInfo}>
                {`By ${auth.currentUser.displayName}`}
            </Text>
            </View>

            
            {Object.keys(auth.currentUser.uid != REVIEWER_ACCOUNT ? playlistMoreOptions : playlistMoreOptions.slice(0, 2)).map((index) => {
          const item = playlistMoreOptions[index];
    
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
PlaylistMoreOptions.propTypes = {
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
        marginBottom: 10,
        fontWeight: 'bold'
      },
      buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold'
        
        
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
        textAlign: 'center',
        fontWeight: 'bold'
      },
      albumInfo: {
        color: colors.greyInactive,
        //fontFamily: fonts.spotifyRegular,
        fontSize: 12,
        marginBottom: 48,
        fontWeight: 'bold'
      }
})