
import React, { useState } from 'react'
import {
    Text,
    View,
    TouchableWithoutFeedback,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Image,
    ImageBackground,
    PermissionsAndroid
  } from 'react-native';
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage'
import PropTypes from 'prop-types'
import { device, gStyle, images, colors, fonts } from '../MusicPlayer/constants/index';
import LineItemCategory from '../TopicContent/LineItemCatagorey'
import moreOptions from './SavedMoreOptions.json'
import * as FileSystem from 'expo-file-system';

//import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { downloadAudioToDevice } from './DownloadToDevice';

export default function SavedMoreOptions(props) {

    const {
        albumTitle, albumCover, albumArtist,
        deleteMusicItem, currentAudioURI,
        addMusicToPlaylist, playListName, removeFromPlaylist
       
    
    } = props.route.params;

    const [showMusicBar, setShowMusicBar] = useState(false);


    function handleIconClick(item){
        if (item.id == 3){
            addMusicToPlaylist()
        }
        if (item.id == 4){
          console.log("audio URI under here")
          console.log(currentAudioURI)
          downloadAudioToDevice(currentAudioURI, albumTitle)
        }
        else if (item.id == 5){
          if (playListName == undefined){
            deleteMusicItem()
          } else {
            removeFromPlaylist()
          }
            
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

            {Object.keys(moreOptions).map((index) => {
            const item = moreOptions[index];

            return (
                <LineItemCategory
                key={item.id}
                disableRightSide
                icon={item.icon}
        
                iconLibrary={item.lib}
                onPress={() => handleIconClick(item)}
                title={item.id == 5 && playListName != undefined ? `Remove from ${playListName}` :   item.title}
                />
            );
            })}

            
        </ScrollView>
        
        
            </React.Fragment>
        </ImageBackground>
    )

    
}
SavedMoreOptions.propTypes = {
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
       // fontFamily: fonts.spotifyBold,
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