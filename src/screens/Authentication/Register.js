import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Platform
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
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';



function Register({ navigation }){

    const [selectedOption, setSelectOption] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)

    function googleRegister(){
         return (
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
         )
    }

    async function appleLogIn(){
        const nonce = Math.random().toString(36).substring(2, 10);

        return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
            .then((hashedNonce) =>
                AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL
                    ],
                    nonce: hashedNonce
                })
            )
            .then((appleCredential) => {
                const { identityToken } = appleCredential;                                                                                                                                
                const provider = new firebase.auth.OAuthProvider('apple.com');
                const credential = provider.credential({
                    idToken: identityToken,
                    rawNonce: nonce
                });
                return firebase.auth().signInWithCredential(credential);
                // Successful sign in is handled by firebase.auth().onAuthStateChanged                                                  
            })
            .catch((error) => {
                console.warn("This did not work")
                console.log(error)
            });

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
                    inputStyle={{color: "white"}}
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
                    inputStyle={{color: "white"}}
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
                    inputStyle={{color: "white"}}
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
        function renderLoginOptions(){
            if (Platform.OS == 'ios'){
                return (
                   <>
                    <Text
                    style={{
                        textAlign: 'center',
                        marginTop: SIZES.radius,
                        color: "#177aeb",
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
                        icon={icons.apple}
                        label="Sign in with Apple"
                        onPress={appleLogIn}
                        containerStyle={{
                            flex: 1,
                            marginRight: SIZES.padding,
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
                </>
                )
            }
        }
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
                        backgroundColor: "#177aeb"
                    }}
                    label="CREATE ACCOUNT"
                onPress={register}
                />

                {renderLoginOptions()}

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
                            color: "#177aeb"
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
        <ImageBackground style={styles.image} source={ SECONDARY_BG}>
            {/* Title */}
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
           

            <Image 
                style={{height: 100, width: 100, marginLeft: "35%", marginRight: "30%", marginBottom: "5%", marginTop: "15%"}} 
                source={require('../../../assets/transparent_soundico.png')}
            ></Image>

<Text
                style={{
               
                    marginBottom: 20,
                    textAlign: 'center',
                    ...FONTS.h1,
                    color: "white"
                }}
            >
                Sign up for free 
            </Text>


            {/* Form */}
            
                
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