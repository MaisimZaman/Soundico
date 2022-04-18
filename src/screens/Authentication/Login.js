import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
    FormInput,
    IconButton,
    IconLabelButton,
    TextButton,
} from "../../components/AuthComponents";
import { COLORS, FONTS, SIZES, images, icons } from "./constants";

import {auth, db} from '../../../services/firebase'
import { BG_IMAGE } from '../../services/backgroundImage';

function Login({ navigation }){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)

    
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

        console.log("This is a corrrect sign in")
        
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
                    onChange={(value) => {
                        setUsername(value)
                    }}
                />

                {/* Password */}
                <FormInput
                    label="Password"
                    secureTextEntry={!showPass}
                    autoCompleteType="password"
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
        return (
            <View>
                {/* Login */}
                <TextButton
                    contentContainerStyle={{
                        height: 60,
                        marginTop: 30,
                        borderRadius: 30,
                        backgroundColor: COLORS.primary
                    }}
                    label="LOGIN"
                    onPress={signIn}
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
                            color: COLORS.primary
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
        <ImageBackground style={styles.image} source={ BG_IMAGE}>
            {/* Background */}
            <Image
                source={images.bg}
                resizeMode="cover"
                style={{
                    position: 'absolute',
                    top: 0,
                    width: SIZES.width,
                    height: 300
                }}
            />

            {/* Title */}
            <Text
                style={{
                    marginTop: 60,
                    textAlign: 'center',
                    ...FONTS.h1
                }}
            >
                Login
            </Text>

            <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={"handled"}
                enableResetScrollToCoords={false}
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 30
                }}
            >
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