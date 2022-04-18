import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import AlbunsList from '../../components/AlbunsList'
import React, {useEffect, useState} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage'
import { API_KEY } from '../Search/YoutubeApi'
import Axios from 'axios'


export default function TopicContent(props) {
    const {topic} = props.route.params
    const [content, setAllContent] = useState([])

    useEffect(() => {
        
        Axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${topic}&key=${API_KEY}`)
          .then(res => {
            const thisContent = res.data.items;
            setAllContent(thisContent)
            
            
        })
    
      }, [props.navigation])

    return (
        <ImageBackground style={styles.image} source={ BG_IMAGE}>
            <Text style={{fontSize: 24, color: "white", marginTop: 15}}>{topic}</Text>
            <FlatList
            data={content}
            keyExtractor={(item) => `${item.id}`}
            showsVerticalScrollIndicator={true}
            style={{marginTop: 50, marginRight: 20}}
            numColumns={2}
            renderItem={({ item }) => (
            <TouchableOpacity style={{marginBottom: 15}} onPress={() => props.navigation.navigate('VideoScreen', {videoId: item.id.videoId, videoThumbNail:item.snippet.thumbnails.high.url, videoTitle: item.snippet.title, Search: false })}>
              <AlbunsList name={item.snippet.title} photoAlbum={item.snippet.thumbnails.high.url} podcast={true} />
            </TouchableOpacity>
          )}
        />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
      },
})