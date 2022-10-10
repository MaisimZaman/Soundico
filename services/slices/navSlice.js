import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    thumbNail: null,
    audioURI: null,
    title: null,
    channelId: null,
    audioID: [null, null],
    author: "unknown",
    downloadData: null,
    soundStatus: 0,
    isAudioOnly: true,
    isRecently: false,
    paused: false,


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
        setSoundStatus: (state, action) => {
            state.soundStatus = action.payload;
        },
        setIsAudioOnly: (state, action) => {
            state.isAudioOnly = action.payload;
        },
        setAuthor: (state, action) => {
            state.author = action.payload;
        },
        setChannelId: (state, action) => {
            state.channelId = action.payload;
        },
        setIsRecently: (state, action) => {
            state.isRecently = action.payload;
        },
        setPaused: (state, action) => {
            state.paused = action.payload;
        },
        
    },

});

export const {
    setThumbNail, 
    setAudioURI, 
    setTitle, 
    setAudioID, 
    setDownloadData, 
    setSoundStatus, 
    setIsAudioOnly, 
    setAuthor, 
    setChannelId,
    setIsRecently,
    setPaused

} = navSlice.actions;

export const selectThumbNail = (state) => state.nav.thumbNail

export const selectAudioURI = (state) => state.nav.audioURI

export const selectTitle = (state) => state.nav.title

export const selectAudioID = (state) => state.nav.audioID

export const selectDownloadData = (state) => state.nav.downloadData


export const selectSoundStatus = (state) => state.nav.soundStatus

export const selectIsAudioOnly = (state) => state.nav.isAudioOnly

export const selectAuthor = (state) => state.nav.author

export const selectChannelId = (state) => state.nav.channelId

export const selectIsRecently = (state) => state.nav.isRecently

export const selectPaused = (state) => state.nav.paused

const navReducer = navSlice.reducer

export default navReducer;
