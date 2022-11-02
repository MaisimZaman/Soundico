import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    FormInput,
    IconButton,
    IconLabelButton,
    TextButton,
} from "../../components/AuthComponents";
import { COLORS, FONTS, SIZES, images, icons } from "./constants";
import * as firebase from 'firebase';
import {auth, db} from '../../../services/firebase'
import { BG_IMAGE, SECONDARY_BG } from '../../services/backgroundImage';
//import * as Google from 'expo-auth-session/providers/google';

import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';









function Login({ navigation }){

    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    
    
    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser){
                navigation.replace("Main")
                

            }

        });

        return unsubscribe;
        
    }, [])

    

    

    
    

    function signIn(){
       auth.signInWithEmailAndPassword(username, password)
        .catch(error => alert(error))

     
        
    }

    async function googleSignIn(){
        
  
    }

    console.log(userInfo)

    async function appleSignIn(){
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

    
    

    function renderForm() {
        return (
            <View>
                {/* Username */}
                <FormInput
                    label="Username or Email"
                    keyboardType="email-address"
                    autoCompleteType="email"
                    value={username}
                    inputStyle={{color: "white"}}
                    onChange={(value) => {
                        setUsername(value)
                    }}
                />

                {/* Password */}
                <FormInput
                    label="Password"
                    secureTextEntry={!showPass}
                    autoCompleteType="password"
                    inputStyle={{color: "white"}}
                    containerStyle={{
                        marginTop: SIZES.padding
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
        function loginOptions(){
            if (Platform.OS == 'ios'){
                return (
                    <>
                    {/* Divider */}
                <Text
                style={{
                    textAlign: 'center',
                    marginTop: SIZES.radius,
                    color: '#177aeb',
                    ...FONTS.body3
                }}
            >
                or login with
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
                        onPress={appleSignIn}
                        label="Sign in with Apple"
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
            <View>
                {/* Login */}
                <TextButton
                    contentContainerStyle={{
                        height: 60,
                        marginTop: 30,
                        borderRadius: 30,
                        backgroundColor: "#177aeb"
                    }}
                    label="LOGIN"
                    onPress={signIn}
                />

                
                {loginOptions()}

                {/* Sign Up */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: SIZES.padding
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.gray40,
                            ...FONTS.body3
                        }}
                    >
                        New User?
                    </Text>
                    <TextButton
                        label="Sign Up Now"
                        labelStyle={{
                            color: '#177aeb'
                        }}
                        contentContainerStyle={{
                            marginLeft: SIZES.radius,
                            backgroundColor: null
                        }}
                        onPress={() => navigation.navigate("Register")}
                    />
                </View>

            </View>
        )
    }

    return (
        <ImageBackground style={styles.image} source={ SECONDARY_BG}>
            
            {/* Background */}
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={"handled"}
                enableResetScrollToCoords={false}
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 30,
                    //marginTop: "20%"
                }}
            >

            {/* Title */}
            
                
            <Image 
                style={{height: 130, width: 130, marginLeft: "30%", marginRight: "30%", marginBottom: "5%"}} 
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
                Soundico 
            </Text>

            
                {/* Form */}
                {renderForm()}

                {/* Buttons */}
                {renderButtons()}
                </KeyboardAwareScrollView>

                
                

                

                
            
        </ImageBackground>
    )
}

export default Login

const styles = StyleSheet.create({
 
    image: {
      flex: 1,
      justifyContent: "center"
    },
   
  });