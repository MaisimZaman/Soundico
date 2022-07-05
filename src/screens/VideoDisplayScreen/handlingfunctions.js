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

export async function downloadAudioOrVideo(isVideo=false, isPodCast=false, saveVideoData,saveAudioData, saveAudioPodCastData, currentVideoID, downloadProcessing, setDownloadProcessing){
   if (!downloadProcessing){
        let childPath;
        let theDownload;
        
        if (isVideo){
        let info = await ytdl.getInfo(currentVideoID);
        let audioFormats = ytdl.filterFormats(info.formats, 'audioandvideo');
            theDownload = audioFormats[0].url
            console.log(theDownload)
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
                        setDownloadProcessing(true)
                        saveVideoData(snapshot)
                        setModalVisible(false)
            
                    } else {
                        if (isPodCast){
                            setDownloadProcessing(true)
                            saveAudioPodCastData(snapshot)
                            setModalVisible(false)
                        } else {
                            setDownloadProcessing(true)
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
        
}



