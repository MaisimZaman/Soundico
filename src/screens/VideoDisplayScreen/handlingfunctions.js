import ytdl from "react-native-ytdl"
import {db, auth} from '../../../services/firebase'
import firebase from 'firebase'


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



export function skipFowardTrack(downloadData, setNewSongData, currentID, isRecently, isPlaylist){
    const index = downloadData.findIndex(object => {
      return object.id === currentID[0];
    });
    

    if (index < downloadData.length){

       if (isRecently){
        const forwardThumbNail =  downloadData[index + 1].data.videoThumbNail
        const forwardAudioURI = null
        const forwardTitle = downloadData[index + 1].data.videoTitle
        const forwardID = [downloadData[index + 1].id,  downloadData[index + 1].data.videoId]
        const forwardArtist = downloadData[index + 1].data.videoArtist
        setNewSongData(forwardThumbNail, forwardAudioURI, forwardTitle, forwardID, forwardArtist)
       }
       else {
        const forwardThumbNail =  downloadData[index + 1].snippet.thumbnails.high.url
        const forwardAudioURI = null
        const forwardTitle = downloadData[index + 1].snippet.title
        const forwardID = [downloadData[index + 1].id, isPlaylist ? downloadData[index + 1].snippet.resourceId.videoId : downloadData[index + 1].id.videoId]
        const forwardArtist = downloadData[index + 1].snippet.channelTitle
        setNewSongData(forwardThumbNail, forwardAudioURI, forwardTitle, forwardID, forwardArtist)
       }
    
    
        

      
      
      

    }
  }


export function skipBackwardTrack(downloadData, setNewSongData, currentID, isRecently, isPlaylist){
    const index = downloadData.findIndex(object => {
        return object.id === currentID[0];
    });
    
    if (index >= 0){
        if (isRecently){
            const backwardThumbNail =  downloadData[index - 1].data.videoThumbNail
            const backwardAudioURI = null
            const backwardTitle = downloadData[index - 1].data.videoTitle
            const backwardID = [downloadData[index - 1].id, downloadData[index - 1].data.videoId]
            const backwardArtist = downloadData[index - 1].data.videoArtist
            setNewSongData(backwardThumbNail, backwardAudioURI, backwardTitle, backwardID, backwardArtist)
        
        }
           else {
            const backwardThumbNail =  downloadData[index - 1].snippet.thumbnails.high.url
            const backwardAudioURI = null
            const backwardTitle = downloadData[index - 1].snippet.title
            const backwardID = [downloadData[index - 1].id, isPlaylist ? downloadData[index - 1].snippet.resourceId.videoId : downloadData[index - 1].id.videoId]
            const backwardArtist = downloadData[index - 1].snippet.channelTitle
            setNewSongData(backwardThumbNail, backwardAudioURI, backwardTitle, backwardID, backwardArtist)
           }
        
        

    }
}

export async function downloadAudioOrVideo(isVideo=false, isPodCast=false, saveVideoData,saveAudioData, saveAudioPodCastData, currentVideoID, downloadProcessing, setDownloadProcessing, currentAudioURI){
   if (!downloadProcessing){
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

        //saveAudioData(theDownload);

      

    
      
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
        
}



