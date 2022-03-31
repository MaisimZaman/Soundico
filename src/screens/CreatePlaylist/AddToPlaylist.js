import { StyleSheet, Text, View, ImageBackground, TouchableOpacity,FlatList, TextInput, Button } from 'react-native'
import Playlist from '../../components/Playlist';
import React, {useState, useEffect} from 'react'
import { BG_IMAGE } from '../../services/backgroundImage';
import { auth, db } from '../../../services/firebase';


export default function AddToPlaylist(props) {

    const {playListTitle} = props.route.params;
    const [searchText, setSearchText] = useState('')
    const [allMusic, setAllMusic] = useState([])
    const [selectedDownloads, setSelectedDownloads] = useState([])
    

    useEffect(() => {
        let unsubscribe = db.collection('audioDownloads')
                          .doc(auth.currentUser.uid)
                          .collection('userAudios')
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
        setSelectedDownloads(selectedDownloads => [...selectedDownloads, item])
    }

    function buildPlaylist(){
        db.collection('playlists')
            .doc(auth.currentUser.uid)
            .collection("userPlaylists")
            .add({
                playlistTitle: playListTitle,
                playListThumbnail: selectedDownloads[0].data.thumbNail,
                playlistVideos: selectedDownloads,
                isCustom: true

                
            })
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

    

    return (
        <ImageBackground style={styles.image} source={{uri: BG_IMAGE}}>
            <Text style={{color: "white", fontSize: 24, marginBottom: 15}}>add songs to {playListTitle}</Text>
            <TextInput 
                style={{flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: "#fff", height: 45, width: "94%", borderRadius: 10, marginBottom: 20}}
                placeholder={'Search for your music'}
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                //onSubmitEditing={() => fetchMusic(searchText)}
    
    ></TextInput>

            <FlatList
                data={allMusic}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => addDownloadToPlaylist(item)}>
              <Playlist
                name={item.data.title}
                photoAlbum={item.data.thumbNail}
                create={true}
              />
            </TouchableOpacity>
          )}
        />
        <Button title='Create Playlist' onPress={buildPlaylist} disabled={selectedDownloads.length == 0}></Button>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
      },
})