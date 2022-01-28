import {combineReducers, createStore} from "redux"
import { applyMiddleware } from "redux"
import thunkMiddleware from 'redux-thunk'

import { authReducer } from "./reducers/auth"
import { projectsListReducer } from "./reducers/projectsList"
import { mediafilesReducer } from './reducers/mediafiles'
import { containersListReducer } from './reducers/containersList'
import { themeOptionsReducer } from './reducers/themeOptions'


const reducers = combineReducers({
    auth: authReducer,
    projectsList: projectsListReducer,
    mediafiles: mediafilesReducer,
    containersList: containersListReducer,
    ThemeOptions: themeOptionsReducer
})

export const store = createStore(reducers, applyMiddleware(thunkMiddleware))

window.store = store