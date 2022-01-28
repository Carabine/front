import { AuthActions } from './../actions/auth'

const initialState = {
    isAuth: false,
    initialized: false,
    lang: window.localStorage.lang || 'en',
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AuthActions.SUCCESS_AUTH: {
            return {
                ...state,
                isAuth: true,
                initialized: true
            }
        }
        case AuthActions.FAIL_AUTH:
            return {
                ...state,
                isAuth: false,
                initialized: true
            }
        case AuthActions.CHANGE_LANG: {
            window.localStorage.lang = action.lang
            return {
                ...state,
                lang: action.lang
            }
        }        
        default:
            return state
    }
}