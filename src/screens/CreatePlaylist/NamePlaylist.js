import { StyleSheet, Text, View, ImageBackground, TextInput, Button } from 'react-native'
import React, {useState} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage'

export default function NamePlaylist({navigation}) {

  const [titleText, setTitleText] = useState('')

  return (
    <ImageBackground style={styles.image} source={{uri: BG_IMAGE}}>
      <Text style={{textAlign: 'center', color: "white", fontSize: 24, marginBottom: 15}}>Give your playlist a name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setTitleText(text)}
        value={titleText}
        placeholder="Enter your playlist title.."
        
      />
      <Button title='Create' onPress={() => navigation.navigate('AddToPlaylist', {playListTitle: titleText})}></Button>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
      },
      input: {
        height: 40,
        margin: 12,
        padding: 10,
        color: "white"
      },

})