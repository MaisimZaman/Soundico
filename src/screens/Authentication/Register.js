import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    FormInput,
    IconButton,
    IconLabelButton,
    TextButton,
} from "../../components/AuthComponents";
import { COLORS, FONTS, SIZES, constants, icons } from "./constants";


import {auth, db} from '../../../services/firebase'
import { BG_IMAGE } from '../../services/backgroundImage';


function Register({ navigation }){

    const [selectedOption, setSelectOption] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)

    function googleRegister(){
         
    }

    

    function register(){
        const defaultProfilePic = 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar-600x600.png'
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            authUser.user.updateProfile({
                displayName: username,
                photoURL: defaultProfilePic,

            })

            
        db.collection("users")
                    .doc(auth.currentUser.uid)
                    .set({
                        displayName: username,
                        email: email,
                        photoURL: defaultProfilePic,
                        uid: auth.currentUser.uid,
                        processed: false,
                    })
        })
        .catch((error) => alert(error.message));


    }

    

    

    function renderForm() {
        return (
            <View
                style={{
                    marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius
                }}
            >
                {/* Username */}
                <FormInput
                    label="Username"
                    value={username}
                    onChange={(value) => {
                        setUsername(value)
                    }}
                />

                {/* Email */}
                <FormInput
                    label="Email"
                    keyboardType="email-address"
                    autoCompleteType="email"
                    value={email}
                    containerStyle={{
                        marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius
                    }}
                    onChange={(value) => {
                        setEmail(value)
                    }}
                />

                {/* Password */}
                <FormInput
                    label="Password"
                    secureTextEntry={!showPass}
                    autoCompleteType="password"
                    containerStyle={{
                        marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius
                    }}
                    value={password}
                    onChange={(value) => setPassword(value)}
                    appendComponent={
                        <IconButton
                            icon={showPass ? icons.eye_close : icons.eye}
                            iconStyle={{
                                height: 20,
                                width: 20,
                                tintColor: COLORS.gray30
                            }}
                            onPress={() => setShowPass(!showPass)}
                        />
                    }
                />
            </View>
        )
    }

    function renderButtons() {
        return (
            <View
                style={{
                    flex: 1,
                }}
            >
                {/* Login */}
                <TextButton
                    contentContainerStyle={{
                        height: SIZES.height > 800 ? 60 : 50,
                        marginTop: SIZES.height > 800 ? 30 : 20,
                        borderRadius: 30,
                        backgroundColor: COLORS.primary
                    }}
                    label="CREATE ACCOUNT"
                onPress={register}
                />

                {/* Divider */}
                <Text
                    style={{
                        textAlign: 'center',
                        marginTop: SIZES.radius,
                        color: COLORS.gray80,
                        ...FONTS.body3
                    }}
                >
                    or sign up with
                </Text>

                {/* Social Logins */}
                <View
                    style={{
                        flexDirection: 'row',
                        height: 60,
                        marginTop: SIZES.radius
                    }}
                >
                    <IconLabelButton
                        icon={icons.google}
                        label="Google"
                        containerStyle={{
                            flex: 1,
                            borderRadius: 30,
                            backgroundColor: COLORS.additionalColor9
                        }}
                        iconStyle={{
                            width: 30,
                            height: 30,
                        }}
                        onPress={googleRegister}
                    />

                    <IconLabelButton
                        icon={icons.facebook}
                        label="Facebook"
                        containerStyle={{
                            flex: 1,
                            marginLeft: SIZES.padding,
                            borderRadius: 30,
                            backgroundColor: COLORS.additionalColor9
                        }}
                        iconStyle={{
                            width: 30,
                            height: 30,
                        }}
                    />
                </View>

                {/* Sign Up */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: SIZES.height > 800 ? SIZES.padding : SIZES.radius
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.gray40,
                            ...FONTS.body3
                        }}
                    >
                        Already a User?
                    </Text>
                    <TextButton
                        label="Login"
                        labelStyle={{
                            color: COLORS.primary
                        }}
                        contentContainerStyle={{
                            marginLeft: SIZES.radius,
                            backgroundColor: null
                        }}
                        onPress={() => navigation.navigate("Login")}
                    />
                </View>
            </View>
        )
    }

    return (
        <ImageBackground style={styles.image} source={{uri: BG_IMAGE}}>
            {/* Title */}
            <Text
                style={{
                    marginTop: SIZES.height > 800 ? 60 : 30,
                    textAlign: 'center',
                    ...FONTS.h1
                }}
            >
                Register
            </Text>

            {/* Form */}
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={"handled"}
                enableResetScrollToCoords={false}
                contentContainerStyle={{
                    flex: 1,
                    paddingHorizontal: 30,
                }}
            >
                
                {renderForm()}
                {renderButtons()}
            </KeyboardAwareScrollView>
        </ImageBackground>
    )
}


export default Register;

const styles = StyleSheet.create({
 
    image: {
      flex: 1,
      justifyContent: "center"
    },
   
  });