import { mediafilesAPI } from './../../api/index'
import config from './../../config'
import { uuid } from './../../utils/uuid'
import axios from 'axios'

export const MediafilesActions = {
    SET_IS_MODAL_OPEN: 'mediafiles/SET_IS_MODAL_OPEN',
    ADD_MEDIAFILES: 'mediafiles/ADD_MEDIAFILES',
    SET_MEDIAFILES: 'mediafiles/SET_MEDIAFILES',
    UPLOAD_FILES: 'mediafiles/UPLOAD_FILES',
    REMOVE_MEDIAFILE: 'mediafiles/REMOVE_MEDIAFILE',
    ADD_FILES: 'mediafile/ADD_FILES',
    REMOVE_FILE: 'mediafiles/REMOVE_FILE',
    CLEAR_FILES: 'mediafiles/CLEAR_FILES',
    SET_IS_UPLOADING: 'mediafiles/SET_IS_UPLOADING',
    SET_ERROR: 'mediafiles/SET_ERROR',
    SET_FILE_PERCENT: 'mediafiles/SET_FILE_PERCENT',
    CHANGE_VIDEO_NAME: 'mediafiles/CHANGE_VIDEO_NAME',
    SET_CURRENT_VIDEO: 'mediafiles/SET_CURRENT_VIDEO',
    SET_VIDEO_EDIT_MODE: 'mediafiles/SET_VIDEO_EDIT_MODE',
    SET_MAIN_PERCENT: 'mediafile/SET_MAIN_PERCENT'
}

export const setIsModalOpen = (isModalOpen) => ({type: MediafilesActions.SET_IS_MODAL_OPEN, isModalOpen})
export const addMediafiles = (mediafiles) => ({type: MediafilesActions.ADD_MEDIAFILES, mediafiles})
export const setMediafiles = (mediafiles) => ({type: MediafilesActions.SET_MEDIAFILES, mediafiles})
const removeMediafile = (mediafileId) => ({type: MediafilesActions.REMOVE_MEDIAFILE, mediafileId})
export const addFiles = (files) => ({type: MediafilesActions.ADD_FILES, files})
export const removeFile = (fileId) => ({type: MediafilesActions.REMOVE_FILE, fileId})
export const clearFiles = () => ({type: MediafilesActions.CLEAR_FILES})
const setIsUploading = (isUploading) => ({type: MediafilesActions.SET_IS_UPLOADING, isUploading})
export const setError = (error) => ({type: MediafilesActions.SET_ERROR, error})
const setFilePercent = (percent) => ({type: MediafilesActions.SET_FILE_PERCENT, percent})
export const changeVideoName = (videoId, name) => ({type: MediafilesActions.CHANGE_VIDEO_NAME, videoId, name})
export const setCurrentVideo = (video) => ({type: MediafilesActions.SET_CURRENT_VIDEO, video})
export const setVideoEditMode = (videoId, editMode) => ({type: MediafilesActions.SET_VIDEO_EDIT_MODE, videoId, editMode})
export const setMainPercent = (percent) => ({type: MediafilesActions.SET_MAIN_PERCENT, percent})

export const uploadFiles = (files) => {
    return async (dispatch) => {
        try {
            const id = uuid()

            const formData = new FormData()
            for(let i = 0; files.length > i; i++) {
                console.log(files[i])
                formData.append(i, files[i])
            }            
            
            dispatch(setIsUploading(true))
            const { data: {domain} } = await mediafilesAPI.getMediaserver()

            const eventSource = new EventSource(`${config.protocol}://${domain}/sse/${id}`, {withCredentials: true})

            eventSource.addEventListener('videoHasUploaded:' + id, async event => {
                const data = JSON.parse(event.data)
                const res = await mediafilesAPI.saveMediafile({...data, domain})
                dispatch(addMediafiles([res.data]))
                dispatch(removeFile())
                dispatch(setFilePercent(0))
            });

            eventSource.addEventListener('progressVideoData:' + id, event => {
                const data = JSON.parse(event.data)
                dispatch(setFilePercent(data.percent))
            });

            await axios.post(`${config.protocol}://${domain}/mediafiles/${id}`, formData, {withCredentials: true, headers: {'content-type': 'multipart/form-data'}, 
            onUploadProgress: function(progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                
                dispatch(setMainPercent(percentCompleted === 100 ? 0 : percentCompleted))
              }})
            dispatch(clearFiles())         
            dispatch(setIsModalOpen(false))
            dispatch(setFilePercent(0))
            setTimeout(() => eventSource.close(), 10000)
        } catch(err) {
            dispatch(setError('uploadingError'))
        }
        dispatch(setIsUploading(false))
    }
}

export const fetchMediafiles = () => {
    return async (dispatch) => {
        try {
            const res = await mediafilesAPI.fetchMediafiles()
            dispatch(setMediafiles(res.data))
            if(res.data.length) {
                dispatch(setCurrentVideo(res.data[0]))
            }
        } catch(err) {
            dispatch(setError('fetchingMediafilesError'))
        }
    }
}

export const deleteMediafile = (mediafileId) => {
    return async (dispatch) => {
        try {
            await mediafilesAPI.deleteMediafile(mediafileId)
            dispatch(removeMediafile(mediafileId))
        } catch(err) {
            dispatch(setError('deletingMediafilesError'))
        }
    }
}
