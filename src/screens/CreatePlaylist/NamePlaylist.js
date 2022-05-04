import { StyleSheet, Text, View, ImageBackground, TextInput, Button } from 'react-native'
import React, {useState} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function NamePlaylist({navigation}) {

  const [titleText, setTitleText] = useState('')

  

  return (
    <ImageBackground style={styles.image} source={ BG_IMAGE}>
      <Text style={{textAlign: 'center', color: "white", fontSize: 24, marginBottom: 30, fontStyle: 'italic'}}>Give your Playlist a name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setTitleText(text)}
        value={titleText}
        textAlign='center'
        placeholder="Enter your playlist title.."
        
      />
      <TouchableOpacity disabled={titleText == ''} onPress={() => navigation.navigate('AddToPlaylist', {playListTitle: titleText})}>
        <Text style={{color: "white", fontSize: 22,  textAlign: 'center', marginTop: "10%",  marginBottom: "5%", color: "green"}}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{color: "white", fontSize: 22, textAlign: 'center', }}>Cancel</Text>
      </TouchableOpacity>
      
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
      },
      input: {
        height: 50,
        marginTop: 15,
        padding: 10,
        color: "white",
        fontSize: 24,
        fontStyle: 'italic'
      },

})