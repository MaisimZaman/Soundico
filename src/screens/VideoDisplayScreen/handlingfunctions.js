import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'

export function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;

   
  
    if (secs < 10){
      return  mins + ':' + "0" + secs;
    }
    return  mins + ':' + secs;
  }

export async function downloadAudioOrVideo(isVideo=false, isPodCast=false){
    let childPath;
    let theDownload;

    if (isVideo){
      let info = await ytdl.getInfo(currentVideoID);
      let audioFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
        theDownload = audioFormats[0].url
        console.log(urls)
        childPath = `videoDownloads/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    }
    else {
        let info = await ytdl.getInfo(String(currentVideoID));
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        theDownload = audioFormats[0].url
        console.log(theDownload)
        childPath = `audioDownloads/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    }

  
    
    
    const response = await fetch(theDownload);
    const blob = await response.blob();

    const task = firebase
        .storage()
        .ref()
        .child(childPath)
        .put(blob);

    const taskProgress = snapshot => {
        console.log(`transferred: ${snapshot.bytesTransferred}`)
    }
    const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
                console.log("This happened")

                if (isVideo){
                    saveVideoData(snapshot)
                    setModalVisible(false)
        
                } else {
                    if (isPodCast){
                        saveAudioPodCastData(snapshot)
                        setModalVisible(false)
                    } else {
                        saveAudioData(snapshot);
                        setModalVisible(false)
                    }
                    
                }  
            
        })
    }
    const taskError = snapshot => {
        console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);
    
}


function saveAudioData(downloadURL){
    db.collection('audioDownloads')
        .doc(auth.currentUser.uid)
        .collection("userAudios")
        .add({
            audio: downloadURL,
            thumbNail: currentThumbnail,
            title: currentTitle,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        })

        props.navigation.replace('MusicScreen', {thumbNail: currentThumbnail,
            audioURI: downloadURL, 
            title: currentTitle,
            downloadData: downloadURL,
                        audioID: '2121'
                            })

}

export function saveAudioPodCastData(downloadURL){
    db.collection('podcastDownloads')
        .doc(auth.currentUser.uid)
        .collection("userPodcasts")
        .add({
            audio: downloadURL,
            thumbNail: currentThumbnail,
            title: currentTitle,
        })

}

export function saveVideoData(downloadURL){
    db.collection('videoDownloads')
        .doc(auth.currentUser.uid)
        .collection("userVideos")
        .add({
            videoURI: downloadURL,
            thumbNail: currentThumbnail,
            title: currentTitle,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        })

}

export function savePlaylistData(){
    db.collection('playlists')
        .doc(auth.currentUser.uid)
        .collection("userPlaylists")
        .add({

            playlistTitle: plInfo[0],
            playListThumbnail: plInfo[1],
            playlistVideos: playlistVideos,

            
        })

}


