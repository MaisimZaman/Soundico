import { StyleSheet, Text, View, ImageBackground, TouchableOpacity,FlatList, TextInput, Button } from 'react-native'
import Playlist from '../../components/Playlist';
import React, {useState, useEffect} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage';
import { auth, db } from '../../../services/firebase';
import { TextButton } from '../ProfileScreen/ProfileComponents';



export default function AddToMadePlaylist(props){

    const {playListObject} = props.route.params;
    const [searchText, setSearchText] = useState('')
    const [allPlaylists, setAllPlaylists] = useState([])
    const [currentItem, setCurrentItem] = useState(null)


                                                                                                                                                             
    

    useEffect(() => {
        let unsubscribe = db.collection('playlists')
                          .doc(auth.currentUser.uid)
                          .collection('userPlaylists')
                          .where('isCustom', '==', true)
                          .get()
                          .then((snapshot) => {
                              let sPlaylists = snapshot.docs.map(doc => {
                                  const data = doc.data();
                                  const id = doc.id;
                                  return { id: id, data: data }
                              });
                              setAllPlaylists(sPlaylists)
                          })
    
        return unsubscribe;
        
    }, [])

    

    useEffect(() => {
        if (searchText != ''){
            fetchPlaylists(searchText)
        }
    }, [searchText])



    function addToPlaylist(){
        db.collection('playlists')
            .doc(auth.currentUser.uid)
            .collection("userPlaylists")
            .doc(currentItem.id)
            .update({
                playlistVideos: [...currentItem.data.playlistVideos, playListObject]

            })
        
        props.navigation.navigate("AlbumScreen", {title: currentItem.data.playlistTitle, photoAlbum: currentItem.data.playListThumbnail, playlistVideos: [...currentItem.data.playlistVideos, playListObject], isCustom: true })
            
    }

     function fetchPlaylists(search){
        //console.warn("Function was called")
         db.collection('playlists')
            .doc(auth.currentUser.uid)
            .collection('userPlaylists')
            .where('isCustom', '==', true)
            .where('playlistTitle', '==', search)
            .get()
            .then((snapshot) => {
                let sPlaylists = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id: id, data: data }
                });
                setAllPlaylists(sPlaylists);
            })
            
    }

    function itemStyle(item){
        if (currentItem == item){
            return '#054c85' 
            
        }
        
        else {
            return 'null'
        }
    }

    

    return (
        <ImageBackground style={styles.image} source={ BG_IMAGE}>
            <Text style={{color: "white", fontSize: 24, marginBottom: 15, marginTop: 15}}>Chosse playlists`` to add to</Text>
            <TextInput 
                style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: "#fff", height: 45, width: "94%", borderRadius: 10, marginBottom: 20}}
                placeholder={'Search your playlists'}
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                //onSubmitEditing={() => fetchPlaylists(searchText)}
    
    ></TextInput>

            <FlatList
                data={allPlaylists}
                initialNumToRender={allPlaylists.length}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => setCurrentItem(item)}>
              <Playlist
                name={item.data.playlistTitle}
                photoAlbum={item.data.playListThumbnail}
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
                    label="Add Music to this playlist"
                    onPress={addToPlaylist}
                    disabled={currentItem == null}
                    
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