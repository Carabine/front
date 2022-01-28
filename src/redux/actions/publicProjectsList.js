import { containersAPI, projectsAPI } from './../../api/index'

export const ContainersListActions = {
    SET_PROJECTS: 'containersList/SET_PROJECT',
    CHANGE_CONTAINER: 'containersList/CHANGE_CONTAINER',
    CHANGE_PROJECT_NAME: 'containersList/CHANGE_PROJECT_NAME',
    CHANGE_OPTION_NAME: 'containersList/CHANGE_OPTION_NAME',
    ADD_CONTAINER_OPTION: 'containersList/ADD_CONTAINER_OPTION',

}

export const setProjects = (project) => ({type: ContainersListActions.SET_PROJECT, project}) 
const changeContainer = (container) => ({type: ContainersListActions.CHANGE_CONTAINER, container})
export const changeProjectName = (name) => ({type: ContainersListActions.CHANGE_PROJECT_NAME, name})
const changeOptionNameAC = (name, containerId, optionId) => ({type: ContainersListActions.CHANGE_OPTION_NAME, name, containerId, optionId})
const addContainerOptionAC = (projectId, containerId, option) => ({type: ContainersListActions.ADD_CONTAINER_OPTION, projectId, containerId, option})

export const fetchContainers = (projectId) => {
    return async dispatch => {
        const res = await projectsAPI.getProjectData(projectId)
        dispatch(setProject(res.data))
    }
}

export const changeRelation = (projectId, containerId, optionId, containerLinkId) => {
    return async dispatch => {
        const res = await containersAPI.changeRelation(projectId, containerId, optionId, containerLinkId)
        dispatch(changeContainer(res.data))
    }
}

export const deleteContainer = (projectId, containerId) => {
    return async dispatch => {
        await containersAPI.deleteContainer(projectId, containerId)
        const res = await projectsAPI.getProjectData(projectId)
        dispatch(setProject(res.data))
    }
}

export const changeOptionName = (projectId, containerId, optionId, name) => {
    return async dispatch => {
        await projectsAPI.changeOptionName(projectId, containerId, optionId, name)
        dispatch(changeOptionNameAC(name, containerId, optionId))
    }
}

export const addContainerOption = (projectId, containerId, name) => {
    return async dispatch => {
        const res = await projectsAPI.addContainerOption(projectId, containerId, name)
        const option = res.data
        dispatch(addContainerOptionAC(projectId, containerId, option))
    }
}
