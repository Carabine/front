import { ProjectsListActions } from './../actions/projectsList'

const initialState = {
    isFetching: false,
    projects: [],
    isError: false
}

export const projectsListReducer = (state = initialState, action) => {
    switch (action.type) {
        case ProjectsListActions.SET_PROJECTS_LIST: {
            return {
                ...state,
                projects: action.projects,
            }
        }
        case ProjectsListActions.TOGGLE_IS_FETCHING: {
            return {
                ...state,
                isFetching: action.isFetching,
            }
        }
        case ProjectsListActions.ADD_PROJECT: {
            return {
                ...state,
                projects: [action.project, ...state.projects],
            }
        }
        case ProjectsListActions.DELETE_PROJECT: {
            return {
                ...state,
                projects: state.projects.filter(p => p.id !== action.projectId)
            }
        }
        case ProjectsListActions.TOGGLE_IS_ERROR: {
            return {
                ...state,
                isError: action.isError
            }
        }
        default:
            return state
    }
}