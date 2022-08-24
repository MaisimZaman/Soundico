import { StyleSheet, Platform } from "react-native"
import { colors, device, func, gStyle } from '../MusicPlayer/constants/index';

export const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        height:300,
        width:'120%',
        marginBottom: Platform.OS == "ios" ? 40 : 15
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
      image: {
        height: device.width - 48,
        marginVertical: device.iPhoneNotch ? 36 : 8,
        width: device.width - 48
      },
      containerDetails: {
        marginBottom: Platform.OS == "ios"  ? "5%" : 30,
        marginTop: Platform.OS == "ios"  ? "-10%" : 0,
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
        backgroundColor: '#054c85',
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
        fontSize: 25
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
})