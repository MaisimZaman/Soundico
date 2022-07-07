


import { PermissionsAndroid } from 'react-native';
import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';

export async function downloadAudioToDevice(currentAudioURI, albumTitle){

    function replaceIllegalChars(string){
      return string.replace('#','')
      .replace('|', '')
      .replace('%', '')
      .replace('$', '')
      .replace('?', '')
    }

      let fileUri = FileSystem.documentDirectory + `${replaceIllegalChars(albumTitle)}.mp3`;
      FileSystem.downloadAsync(currentAudioURI, fileUri)
      .then(({ uri }) => {
        
          saveFile(uri);
          console.log(uri)
         
        })
        .catch(error => {
          console.error(error);
        })


    async function saveFile(fileUri){
      console.warn(fileUri)
      const checkAndroidPermission = async () => {
        try {
          const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
          await PermissionsAndroid.request(permission);
          console.log("This Process Happened")
          Promise.resolve();
        } catch (error) {
          Promise.reject(error);
        }
      };
      await checkAndroidPermission();
      
        const { status }  = await MediaLibrary.requestPermissionsAsync();

        
        
        if (status === "granted") {
          const asset = await MediaLibrary.createAssetAsync(fileUri)
          await MediaLibrary.createAlbumAsync("SoundicoDownloads", asset, false)
        }
        
    }}
