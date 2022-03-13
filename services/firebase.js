import * as firebase from 'firebase';



const firebaseConfig = {
  apiKey: "AIzaSyDNBGBI7qLsZR_0ZD00HVMK9LQBkpwxY4c",
  authDomain: "music-app-51eec.firebaseapp.com",
  databaseURL: "https://music-app-51eec-default-rtdb.firebaseio.com",
  projectId: "music-app-51eec",
  storageBucket: "music-app-51eec.appspot.com",
  messagingSenderId: "1095020032428",
  appId: "1:1095020032428:web:a25c0d461a13c15dea4a09",
  measurementId: "G-Z7GL3B5D5R"
  };


let app;


if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();

}

const db = app.firestore();
const auth = firebase.auth();

export {db, auth}