import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ImageBackground,
    Modal,
    Pressable,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    IconButton,
    TextButton,
    ProfileValue,
    ProfileRadioButton,
    LineDivider
} from "./ProfileComponents";
import { device, gStyle, colors} from '../MusicPlayer/constants';
import { COLORS, FONTS, SIZES, icons, images } from '../Authentication/constants';
import {auth, db} from '../../../services/firebase'
import firebase from 'firebase'
import { BG_IMAGE } from '../../services/backgroundImage';
import LinearGradient from '../TopicContent/LinearGradient'
import * as ImagePicker from 'expo-image-picker';
import TrackPlayer from 'react-native-track-player';
import { pickedColour } from '../Home/pickedHeaderColour';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccentColour, setAudioID, setAudioURI } from '../../../services/slices/navSlice';


function ProfileScreen(props){

    const [newCourseNotification, setNewCourseNotification] = useState(false)
    const [studyReminder, setStudyReminder] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const dispatch = useDispatch()
    const primaryColour = useSelector(selectAccentColour)

    async function setProfilePicture(){
    

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1.7, 1],
            quality: 1,
            
        });
    
        if (!result.canceled) {
            const image = result.uri;
            const uri = image;
            const childPath = `profile-images/${auth.currentUser.uid}/${Math.random().toString(36)}`;
        

            const response = await fetch(uri);
            const blob = await response.blob();

            const task = firebase
                .storage()
                .ref()
                .child(childPath)
                .put(blob);

            const taskProgress = snapshot => {
                console.log(`transferred: ${snapshot.bytesTransferred}`)
            }

            const taskCompleted = () => {
                task.snapshot.ref.getDownloadURL().then((snapshot) => {
                
                saveImageData(snapshot);
                console.log(snapshot)
            })
            }

            const taskError = snapshot => {
                console.log(snapshot)
            }

            task.on("state_changed", taskProgress, taskError, taskCompleted);
        }


        function saveImageData(downloadURL){

            db.collection("users")
                    .doc(auth.currentUser.uid)
                    .set({
                        photoURL: downloadURL,
                        
                    })

            auth.currentUser.updateProfile({
                photoURL: downloadURL
                }).then(() => {
                navigation.goBack()
                }).catch((error) => {
                console.warn(error)
                }); 

        }
    }

    function deleteMyAccount(){
        const user = firebase.auth().currentUser;

        user.delete().then(() => {
            props.navigation.replace("Login")
        }).catch((error) => {
            console.log(error)
        });
    }

    function RenderModal(){
        
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
                    <Text style={styles.modalText}>Are you sure you want to permanently delete your account? deleteting your account will also remove any associated data with your account.</Text>
                    <Pressable
                      style={[styles.button1, styles.buttonClose]}
                      onPress={deleteMyAccount}>
                      <Text style={styles.textStyle}>Delete Account</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button3, {backgroundColor: "blue"}]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.textStyle}>Don't Delete</Text>
                    </Pressable>
                    
                  </View>
                </View>
              </Modal> 
              
            </View>
          );
    }

    function renderHeader() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 50,
                    paddingHorizontal: SIZES.padding,
                    justifyContent: 'space-between'
                }}
            >
                <Text
                    style={{
                        ...FONTS.h1,
                        color: "white"
                    }}
                >
                    Profile
                </Text>

                <IconButton
                    icon={icons.sun}
                    iconStyle={{
                        tintColor: COLORS.black
                    }}
                />
            </View>
        )
    }

    function renderProfileCard() {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginTop: SIZES.padding,
                    paddingHorizontal: SIZES.radius,
                    paddingVertical: 20,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.primary3
                }}
            >
                {/* Profile Image */}
                <TouchableOpacity
                    style={{
                        width: 80,
                        height: 80,
                    }}
                    onPress={setProfilePicture}
                >
                    <Image
                        source={{uri: auth.currentUser.photoURL}}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 40,
                            borderWidth: 1,
                            borderColor: COLORS.white
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            width: "100%",
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <View
                            style={{
                                width: 30,
                                height: 30,
                                marginBottom: -15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 15,
                                backgroundColor: COLORS.primary
                            }}
                        >
                            <Image
                                source={icons.camera}
                                resizeMode="contain"
                                style={{
                                    width: 17,
                                    height: 17,
                                }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Details */}
                <View
                    style={{
                        flex: 1,
                        marginLeft: SIZES.radius,
                        alignItems: 'flex-start'
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.h2
                        }}
                    >
                        {auth.currentUser.displayName}
                    </Text>

                    <Text
                        style={{
                            color: COLORS.white,
                            ...FONTS.body4
                        }}
                    >
                        Account
                    </Text>

                    {/* Progress */}
                    

                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        
                       
                    </View>

                    {/* Member */}
                    
                </View>
            </View>
        )
    }

    

    function renderProfileSection1() {
        function signOutUser(){
            if (auth.currentUser.uid != null &&  auth.currentUser.uid != undefined){
              auth.signOut().then(() => {
                TrackPlayer.destroy()
                dispatch(setAudioURI(null))
                dispatch(setAudioID(null))
                props.navigation.replace('Login')
              })
          }}
          
        return (
            <View
                style={styles.profileSectionContainer}
            >
                <ProfileValue
                    onPress={signOutUser}
                    icon={icons.profile}
                    label="Switch Account?"
                    value={auth.currentUser.displayName}
                />

                <LineDivider />

                <ProfileValue
                    icon={icons.email}
                    label="Email"
                    value={auth.currentUser.email}
                />

                <LineDivider />

                <ProfileValue
                    icon={icons.password}
                    label="Password"
                    value="Update?"
                />

                <LineDivider />

                <ProfileValue
                    icon={icons.profile}
                    label="Account"
                    value={"Delete Account?"}
                    onPress={() => setModalVisible(true)}
                    
                />
            </View>
        )
    }

    function renderProfileSection2() {
        return (
            <View
                style={styles.profileSectionContainer}
            >
                <ProfileValue
                    icon={icons.star_1}
                    value="Pages"
                />

                <LineDivider />

                <ProfileRadioButton
                    icon={icons.new_icon}
                    label="New Course Notifications"
                    isSelected={newCourseNotification}
                    onPress={() => {
                        setNewCourseNotification(!newCourseNotification)
                    }}
                />

                <LineDivider />

                <ProfileRadioButton
                    icon={icons.reminder}
                    label="Study Reminder"
                    isSelected={studyReminder}
                    onPress={() => {
                        setStudyReminder(!studyReminder)
                    }}
                />
            </View>
        )
    }

    return (
        <ImageBackground style={styles.image} resizeMode="cover" source={ BG_IMAGE}>
            <View style={styles.containerLinear}>
    <LinearGradient fill={primaryColour} />
    
    </View>
        <View
            style={{
                flex: 1,
            }}
        >
            {renderHeader()}

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding,
                    paddingBottom: 150
                }}
            >
                {renderProfileCard()}

                {renderProfileSection1()}

                {RenderModal()}

            </ScrollView>
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({

    profileSectionContainer: {
        marginTop: SIZES.padding,
        paddingHorizontal: SIZES.padding,
        borderWidth: 1,
        borderRadius: SIZES.radius,
        borderColor: COLORS.gray20
    },
    image: {
        flex: 1,
        justifyContent: "center"
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: '#1b1c1f',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 7,
      },
      containerDetails: {
        marginBottom: Platform.OS == "ios"  ? 40 : 30
      },
      containerSong: {
        flex: 6
      },
      song: {
        ...gStyle.textSpotifyBold24,
        color: colors.white
      },
      artist: {
        ...gStyle.textSpotify18,
        color: colors.greyInactive
      },
      containerFavorite: {
        alignItems: 'flex-end',
        flex: 1,
        justifyContent: 'center'
      },
      containerTime: {
        ...gStyle.flexRowSpace
      },
      time: {
        ...gStyle.textSpotify10,
        color: colors.greyInactive
      },
      containerControls: {
        ...gStyle.flexRowSpace,
        marginTop: device.iPhoneNotch ? 24 : 8
      },
      containerBottom: {
        ...gStyle.flexRowSpace,
        marginTop: device.iPhoneNotch ? 32 : 8
      },
      bgImage: {
        flex: 1,
        justifyContent: "center"
      },
      modalView: {
        margin: 20,
        backgroundColor: '#1b1c1f',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 7,
      },
      button1: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 20
      },
      button2: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 20
      },
      button3: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      button4: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 20
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: 'red',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: "white",
        fontSize: 15
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      containerLinear: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: device.web ? 5 : 0
      },

})

export default ProfileScreen;