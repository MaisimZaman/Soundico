import { StyleSheet, Text, View, ImageBackground, TouchableOpacity,FlatList, TextInput, Button } from 'react-native'
import Playlist from '../../components/Playlist';
import React, {useState, useEffect} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage';
import { auth, db } from '../../../services/firebase';
import { TextButton } from '../ProfileScreen/ProfileComponents';
import firebase from 'firebase';



export default function AddToPlaylist(props) {

    const {playListTitle} = props.route.params;
    const [searchText, setSearchText] = useState('')
    const [allMusic, setAllMusic] = useState([])
    const [selectedDownloads, setSelectedDownloads] = useState([])
    
    console.log(allMusic.length)

    useEffect(() => {
        let unsubscribe = db.collection('audioDownloads')
                          .doc(auth.currentUser.uid)
                          .collection('userAudios')
                          .orderBy('creation','desc')
                          .onSnapshot((snapshot) => setAllMusic(snapshot.docs.map(doc => ({
                            id: doc.id,
                            data: doc.data()
                        }))))
    
        return unsubscribe;
        
      }, [])

    useEffect(() => {
        if (searchText != ''){
            fetchMusic(searchText)
        }
    }, [searchText])

    function addDownloadToPlaylist(item){
        if (selectedDownloads.includes(item)){ 
            setSelectedDownloads(selectedDownloads => [...selectedDownloads].splice([...selectedDownloads].indexOf(item)))
        
              
        }
        else {
            setSelectedDownloads(selectedDownloads => [...selectedDownloads, item])
        }
        
    }


    function buildPlaylist(){
        db.collection('playlists')
            .doc(auth.currentUser.uid)
            .collection("userPlaylists")
            .add({
                playlistTitle: playListTitle,
                playListThumbnail: selectedDownloads[0].data.thumbNail,
                playlistVideos: selectedDownloads,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
                isCustom: true

                
            })
        
        props.navigation.navigate("AlbumScreen", {title: playListTitle, photoAlbum: selectedDownloads[0].data.thumbNail, playlistVideos: selectedDownloads, isCustom: true })
            
    }

     function fetchMusic(search){
        //console.warn("Function was called")
         db.collection('audioDownloads')
            .doc(auth.currentUser.uid)
            .collection('userAudios')
            .where('title', '>=', search)
            .get()
            .then((snapshot) => {
                let sMusic = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id: id, data: data }
                });
                setAllMusic(sMusic);
            })
            

        


        

 
       
    }

    function itemStyle(item){
        if (selectedDownloads.includes(item)){
            return '#054c85' 
            
        }
        else {
            return 'null'
        }
    }

    

    

    return (
        <ImageBackground style={styles.image} source={ BG_IMAGE}>
            <View style={{marginTop: 120, marginBottom: 100}}>
            <Text style={{color: "white", fontSize: 24, marginBottom: 15, marginTop: 15}}>Add songs to {playListTitle}</Text>
            <TextInput 
                style={{flexDirection: "row", 
                alignItems: 'center', 
                
                
                fontSize: 15,
                fontWeight: 'bold',
                fontStyle: 'normal',
                justifyContent: 'space-evenly', 
                backgroundColor: "#2a2a2b", 
                color: "white",
                height: 45, 
                width: "94%", 
                borderRadius: 20, 
                marginLeft: "3%"}}
                placeholder={'Search for Music to add'}
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                //onSubmitEditing={() => fetchMusic(searchText)}
    
    ></TextInput>

            <FlatList
                data={allMusic.length > 7 ? allMusic.slice(0, allMusic.length-3) : allMusic}
                initialNumToRender={ allMusic.length}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => addDownloadToPlaylist(item)}>
              <Playlist
                name={item.data.title}
                photoAlbum={item.data.thumbNail}
                create={true}
                backgroundColor={itemStyle(item)}
              />
            </TouchableOpacity>
          )}
        />
        <TextButton
                    contentContainerStyle={{
                        height: 40,
                        marginBottom: 20,
                        borderRadius: 30,
                        backgroundColor: "#054c85"
                    }}
                    label="Create this playlist"
                    onPress={buildPlaylist}
                    disabled={selectedDownloads.length == 0}
                    
                />
                </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
      },
})