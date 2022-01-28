import { MediafilesActions } from './../actions/mediafiles'

const initialState = {
    isModalOpen: false,
    mediafiles: [],
    files: [],
    isUploading: false,
    error: '',
    videoPercent: 0, 
    currentVideo: null,
    mainPercent: 0

}

export const mediafilesReducer = (state = initialState, action) => {
    switch (action.type) {
        case MediafilesActions.SET_IS_MODAL_OPEN: {
            return {
                ...state,
                isModalOpen: action.isModalOpen
            }
        }
        case MediafilesActions.ADD_MEDIAFILES: {
            console.log(action.mediafiles)
            return {
                ...state,
                mediafiles: [...action.mediafiles, ...state.mediafiles]
            }
        }
        case MediafilesActions.SET_MEDIAFILES: {
            return {
                ...state,
                mediafiles: action.mediafiles
            }
        }
        case MediafilesActions.REMOVE_MEDIAFILE: {
            return {
                ...state,
                mediafiles: state.mediafiles.filter(m => m.id !== action.mediafileId)
            }
        }
        case MediafilesActions.ADD_FILES: {
            return {
                ...state,
                files: [...state.files, ...action.files]
            }
        }
        case MediafilesActions.REMOVE_FILE: {
            if(!action.fileId) {
                return {
                    ...state,
                    files: state.files.slice(0, -1)
                }
            } 
            return {
                ...state,
                files: state.files.filter(f => f.id !== action.fileId)
            }
        }
        case MediafilesActions.CLEAR_FILES: {
            return {
                ...state,
                files: []
            }
        }
        case MediafilesActions.SET_IS_UPLOADING: {
            return {
                ...state,
                isUploading: action.isUploading
            }
        }
        case MediafilesActions.SET_ERROR: {
            return {
                ...state,
                error: action.error
            }
        }
        case MediafilesActions.SET_FILE_PERCENT: {
            return {
                ...state,
                filePercent: action.percent
            }
        }
        case MediafilesActions.CHANGE_VIDEO_NAME: {
            return {
                ...state,
                mediafiles: state.mediafiles.map(m => m.id === action.videoId ? {...m, name: action.name} : m)
            }
        }
        case MediafilesActions.SET_CURRENT_VIDEO: {
            return {
                ...state, 
                currentVideo: action.video
            }
        }
        case MediafilesActions.SET_VIDEO_EDIT_MODE: {
            return {
                ...state,
                mediafiles: state.mediafiles.map(m => m.id === action.videoId ? {...m, editMode: action.editMode} : m)
            }
        }
        case MediafilesActions.SET_MAIN_PERCENT: {
            return {
                ...state,
                mainPercent: action.percent 
            }
        }
        default:
            return state
        
    }
}