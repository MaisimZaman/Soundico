import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    thumbNail: null,
    audioURI: null,
    title: null,
    audioID: null,
    downloadData: null,
    soundOBJ: null,

}

export const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers: {
        setThumbNail: (state, action) => {
            state.thumbNail = action.payload;
        },
        setAudioURI: (state, action) => {
            state.audioURI = action.payload;
        },
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        setAudioID: (state, action) => {
            state.audioID = action.payload;
        },
        setDownloadData: (state, action) => {
            state.downloadData = action.payload;
        },
        setSoundOBJ: (state, action) => {
            state.soundOBJ = action.payload;
        },
        
    },

});

export const {setThumbNail, setAudioURI, setTitle, setAudioID, setDownloadData, setSoundOBJ} = navSlice.actions;

export const selectThumbNail = (state) => state.nav.thumbNail

export const selectAudioURI = (state) => state.nav.audioURI

export const selectTitle = (state) => state.nav.title

export const selectAudioID = (state) => state.nav.audioID

export const selectDownloadData = (state) => state.nav.downloadData

export const selectSoundOBJ = (state) => state.nav.soundOBJ

const navReducer = navSlice.reducer

export default navReducer;
