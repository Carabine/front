import {authAPI} from "../../api";

export const AuthActions = {
    SUCCESS_AUTH: 'auth/SUCCESS-AUTH',
    FAIL_AUTH: 'auth/FAIL-AUTH',
    CHANGE_LANG: 'auth/CHANGE_LANG' 
}

export const successAuth = () => ({type: AuthActions.SUCCESS_AUTH})
export const failAuth = () => ({type: AuthActions.FAIL_AUTH})
export const initializeSuccess = () => ({type: AuthActions.INITIALIZE_SUCCESS})
export const changeLang = (lang) => ({type: AuthActions.CHANGE_LANG, lang})

export const auth = () => {
    return async (dispatch) => {
        try {
            const res = await authAPI.auth()
            if(res.data && res.data.lang) {
                dispatch(changeLang(res.data.lang))
            }
            dispatch(successAuth())
        } catch(err) {
            dispatch(failAuth())
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        try {
            await authAPI.logout()
            dispatch(failAuth())
        } catch(err) {
            console.log(err)
        }
    }
}
