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
import {auth} from '../../../services/firebase'
import { BG_IMAGE } from '../../services/backgroundImage';


function ProfileScreen(props){

    const [newCourseNotification, setNewCourseNotification] = useState(false)
    const [studyReminder, setStudyReminder] = useState(false)

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
                    onPress={() => props.navigation.navigate("UpdateProfilePic")}
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