import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    IconButton,
    TextButton,
    ProfileValue,
    ProfileRadioButton,
    LineDivider
} from "./ProfileComponents";
import { COLORS, FONTS, SIZES, icons, images } from '../Authentication/constants';
import {auth, db} from '../../../services/firebase'
import firebase from 'firebase'
import { BG_IMAGE } from '../../services/backgroundImage';
import * as ImagePicker from 'expo-image-picker';


function ProfileScreen(props){

    const [newCourseNotification, setNewCourseNotification] = useState(false)
    const [studyReminder, setStudyReminder] = useState(false)

    async function setProfilePicture(){
    

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1.7, 1],
            quality: 1,
            
        });
    
        if (!result.cancelled) {
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
                        Standard
                    </Text>

                    {/* Progress */}
                    

                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                color: COLORS.white,
                                ...FONTS.body4
                            }}
                        >
                            Overall Progress
                        </Text>
                        <Text
                            style={{
                                color: COLORS.white,
                                ...FONTS.body4
                            }}
                        >
                            58%
                        </Text>
                    </View>

                    {/* Member */}
                    <TextButton
                        label="+ Become Member"
                        contentContainerStyle={{
                            height: 35,
                            marginTop: SIZES.padding,
                            paddingHorizontal: SIZES.radius,
                            borderRadius: 20,
                            backgroundColor: COLORS.white
                        }}
                        labelStyle={{
                            color: COLORS.primary
                        }}
                    />
                </View>
            </View>
        )
    }

    

    function renderProfileSection1() {
        return (
            <View
                style={styles.profileSectionContainer}
            >
                <ProfileValue
                    icon={icons.profile}
                    label="Name"
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
                    value="Updated 2 weeks ago"
                />

                <LineDivider />

                <ProfileValue
                    icon={icons.call}
                    label="Contact Number"
                    value="+60123456789"
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

})

export default ProfileScreen;