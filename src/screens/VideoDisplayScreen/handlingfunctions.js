import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'
import TrackPlayer from "react-native-track-player";

export async function transcribeAudio(audioFile) {
    const apiKey = 'YOUR_API_KEY';
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'config': {
          'encoding': 'LINEAR16',
          'sampleRateHertz': 44100,
          'languageCode': 'en-US',
        },
        'audio': {
          'content': audioFile,
        },
      }),
    });
    const data = await response.json();
    return data.results[0].alternatives[0].transcript;
  }


export function msToTime(duration) {
    var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
}

export const pauseIcon = "https://iconsplace.com/wp-content/uploads/_icons/ffffff/256/png/pause-icon-18-256.png"

export const playIcon = "https://iconsplace.com/wp-content/uploads/_icons/f0f0f0/256/png/play-icon-256.png"



export function skipFowardTrack(downloadData, setNewSongData, currentID, isRecently, isPlaylist, thisIndex){
    const index = downloadData.findIndex(object => {
      return object.id === currentID[0];
    });

    //TrackPlayer.reset()
    

    if (thisIndex < downloadData.length){

       if (isRecently){
        const forwardThumbNail =  downloadData[thisIndex + 1].data.videoThumbNail
        const forwardAudioURI = null
        const forwardTitle = downloadData[thisIndex + 1].data.videoTitle
        const forwardID = [downloadData[thisIndex + 1].id,  downloadData[thisIndex + 1].data.videoId]
        const forwardArtist = downloadData[thisIndex + 1].data.videoArtist
        setNewSongData(forwardThumbNail, forwardAudioURI, forwardTitle, forwardID, forwardArtist)
       }
       else {
        const forwardThumbNail =  downloadData[thisIndex + 1].snippet.thumbnails.high.url
        const forwardAudioURI = null
        const forwardTitle = downloadData[thisIndex + 1].snippet.title
        const forwardID = [downloadData[thisIndex + 1].id, isPlaylist ? downloadData[thisIndex + 1].snippet.resourceId.videoId : downloadData[thisIndex + 1].id.videoId]
        const forwardArtist = downloadData[thisIndex + 1].snippet.channelTitle
        setNewSongData(forwardThumbNail, forwardAudioURI, forwardTitle, forwardID, forwardArtist)
       }
    
    
        

      
      
      

    }
  }


export function skipBackwardTrack(downloadData, setNewSongData, currentID, isRecently, isPlaylist, thisIndex){
    const index = downloadData.findIndex(object => {
        return object.id === currentID[0];
    });

    console.log(thisIndex)

    //TrackPlayer.reset()
    
    if (thisIndex >= 0){
        if (isRecently){
            const backwardThumbNail =  downloadData[thisIndex - 1].data.videoThumbNail
            const backwardAudioURI = null
            const backwardTitle = downloadData[thisIndex - 1].data.videoTitle
            const backwardID = [downloadData[thisIndex - 1].id, downloadData[thisIndex - 1].data.videoId]
            const backwardArtist = downloadData[thisIndex - 1].data.videoArtist
            setNewSongData(backwardThumbNail, backwardAudioURI, backwardTitle, backwardID, backwardArtist)
        
        }
           else {
            const backwardThumbNail =  downloadData[thisIndex - 1].snippet.thumbnails.high.url
            const backwardAudioURI = null
            const backwardTitle = downloadData[thisIndex - 1].snippet.title
            const backwardID = [downloadData[thisIndex - 1].id, isPlaylist ? downloadData[thisIndex - 1].snippet.resourceId.videoId : downloadData[thisIndex - 1].id.videoId]
            const backwardArtist = downloadData[thisIndex - 1].snippet.channelTitle
            setNewSongData(backwardThumbNail, backwardAudioURI, backwardTitle, backwardID, backwardArtist)
           }
        
        

    }
}

export async function downloadAudioOrVideo(isVideo=false, isPodCast=false, saveVideoData,saveAudioData, saveAudioPodCastData, currentVideoID, downloadProcessing, setDownloadProcessing, currentAudioURI){

    let childPath;
    let theDownload = currentAudioURI;

   

    if (isVideo){

        console.log(theDownload)
        childPath = `videoDownloads/${auth.currentUser.uid}/${Math.random().toString(36)}`;
    }
    else {
        
        console.log(theDownload)
        childPath = `audio/${auth.currentUser.uid}/${Math.random().toString(36)}`;
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
                    setDownloadProcessing(true)
                    saveVideoData(snapshot)
            
        
                } else {
                    if (isPodCast){
                        setDownloadProcessing(true)
                        saveAudioPodCastData(snapshot)
                        setModalVisible(false)
                    } else {
                        setDownloadProcessing(true)
                        saveAudioData(snapshot);
                        
                    }
                    
                }  
            
        })
    }
    const taskError = snapshot => {
        console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);

       
   
        
}



