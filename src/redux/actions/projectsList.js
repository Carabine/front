import {projectsAPI} from "../../api";

export const ProjectsListActions = {
    SET_PROJECTS_LIST: 'projectsList/SET_PROJECTS_LIST',
    TOGGLE_IS_FETCHING: 'projectsList/TOGGLE_IS_FETCHING',
    ADD_PROJECT: 'projectsList/ADD_PROJECT',
    DELETE_PROJECT: 'projectsList/DELETE_PROJECT',
    TOGGLE_IS_ERROR: 'projectsList/TOGGLE_IS_ERROR'
}

const setProjectsList = (projects) => ({type: ProjectsListActions.SET_PROJECTS_LIST, projects})
const toggleIsFetching = (isFetching) => ({type: ProjectsListActions.TOGGLE_IS_FETCHING, isFetching})
export const addProjectAC = (project) => ({type: ProjectsListActions.ADD_PROJECT, project})
const deleteProjectAC = (projectId) => ({type: ProjectsListActions.DELETE_PROJECT, projectId})
export const toggleIsError = (isError) => ({type: ProjectsListActions.TOGGLE_IS_ERROR, isError})


export const fetchProjectsList = () => {
    return async (dispatch) => {
        toggleIsFetching(true)
        try {
            const res = await projectsAPI.getProjectsList()
            dispatch(setProjectsList(res.data))
        } catch(err) {
            console.log(err)
            toggleIsError(true)
        }
        toggleIsFetching(false)
    }
}



export const deleteProject = (projectId) => {
    return async (dispatch) => {
        try {
            await projectsAPI.delete(projectId)
            dispatch(deleteProjectAC(projectId))
        } catch(err) {
            console.log(err)
            toggleIsError(true)
        }
    }
}