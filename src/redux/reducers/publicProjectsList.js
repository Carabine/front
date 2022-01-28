import { ContainersListActions } from './../actions/containersList'

const initialState = {
    projects: [],
}

export const containersListReducer = (state = initialState, action) => {
        switch(action.type) {
            case ContainersListActions.SET_PROJECT: {
                console.log(action.project)
                return {
                    ...state,
                    containers: action.project.containers.map((c, index) => ({...c, index})),
                    projectName: action.project.name,
                    categories: action.project.categories,
                    isPublic: action.project.isPublic,
                    desc: action.project.desc,
                    projectLang: action.project.projectLang
                }
            }
            case ContainersListActions.CHANGE_CONTAINER: {
                return {
                    ...state,
                    containers: state.containers.map((c, index) => c.id !== action.container.id ? c : {...action.container, index})
                }
            }
            case ContainersListActions.CHANGE_PROJECT_NAME: {
                return {
                    ...state, 
                    projectName: action.name
                }
            }
            case ContainersListActions.CHANGE_OPTION_NAME: {
                return {
                    ...state,
                    containers: state.containers.map(c => c.id === action.containerId ? {...c, options: c.options.map(opt => opt.id === action.optionId ? {...opt, name: action.name} : opt)} : c),
                }
            }
            case ContainersListActions.ADD_CONTAINER_OPTION: {
                return {
                    ...state,
                    containers: state.containers.map(c => c.id === action.containerId ? {...c, options: [...c.options, action.option]} : c),
                }
            }
            default: {
                return state
            }
        }

}