import axios from 'axios'
import config from './../config'

export const instance = axios.create({
    withCredentials: true,
    baseURL: `${config.backendUrl}/`
})

export const authAPI = {
    async login(formData) {
        console.log(formData)
        return await instance.post('login', formData)
    },
    async signup(formData) {
        return await instance.post('signup', formData)
    },
    async auth() {
        return await instance.get('authme')
    },
    async logout() {
        return await instance.get('logout')
    },
    async changeLang(lang) {
        return await instance.post('lang', {lang})
    },
    async recoverPassword(formData) {
        return await instance.post('password', formData)
    }
}

export const usersAPI = {
    async getPublicUserData(login, limit, offset) {
        return await instance.get(`users/${login}`, { params: { limit, offset }})
    },
    async getProfileData() {
        return await instance.get(`/profile`)
    }
}

export const projectsAPI = {
    async create(formData) {
        return await instance.post('projects', {...formData, projectLang: localStorage.getItem('lang')})
    },
    async delete(projectId) {
        return await instance.delete('projects', {params: {projectId}})
    },
    async getProjectsList() {
        return await instance.get('projects')
    },
    async getProject(projectId) {
        return await instance.get('projects/' + projectId)
    },
    async getPublicProject(projectId) {
        return await instance.get(`publicProjects/${projectId}`)
    },
    async getProjectData(projectId) {
        return await instance.get(`projects/${projectId}`)
    },
    async changeProjectName(projectId, name) {
        return await instance.put(`projects/${projectId}/name`, {name})
    },
    async editProject(projectId, formData) {
        return await instance.put(`projects/${projectId}`, formData)
    },
    async getPublicProjects(lang, category, limit, offset, orderBy, sortByTime, searchText) {
        return await instance.get('publicProjects', { params: { lang, category, limit, offset, orderBy, sortByTime, searchText }})
    },
    async estimateProject(projectId, isLike) {
        return await instance.post(`projects/${projectId}/estimate`, {isLike})
    },
    async incProjectViews(projectId) {
        return await instance.post(`projects/${projectId}/views`)
    },
    async getProjectMeta(projectId) {
        return await instance.get(`projects/${projectId}/meta`)
    },
    async changeOptionName(projectId, containerId, optionId, name) {
        return await instance.put(`/projects/${projectId}/containers/${containerId}/options/${optionId}/name`, {name})
    },
    async addContainerOption(projectId, containerId, name) {
        return await instance.post(`/projects/${projectId}/containers/${containerId}/options`, {name})
    },
    async getProjectInfo(projectId) {
        return await instance.get(`/projects/${projectId}/info`)
    }
}

export const mediafilesAPI = {
    async saveMediafile(files) {
        return await instance.post(`mediafiles`, files, {onUploadProgress: function(progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(percentCompleted)
          }})
    },
    async fetchMediafiles() {
        return await instance.get('mediafiles')
    },
    async deleteMediafile(videoId) {
        return await instance.delete('mediafiles', {params: {videoId}})
    },
    async changeVideoName(videoId, name) {
        return await instance.put(`mediafiles/${videoId}`, {name})
    },
    async getMediaserver() {
        return await instance.get(`mediaserver`)
    }
}

export const containersAPI = {
    async createContainer(formData, projectId) {
        return await instance.post(`projects/${projectId}/containers`, formData)
    },
    async changeRelation(projectId, containerId, optionId, containerLinkId) {
        return await instance.put(`/projects/${projectId}/containers/${containerId}/options`, {optionId, containerLinkId})
    },
    async deleteContainer(projectId, containerId) {
        console.log(containerId)
        return await instance.delete(`/projects/${projectId}/containers/${containerId}`)
    },
    async getContainerData(projectId, containerId) {
        return await instance.get(`/projects/${projectId}/containers/${containerId}`)
    },
    async editContainer(formData, projectId, containerId) {
        return await instance.put(`/projects/${projectId}/containers/${containerId}`, formData)
    },
    async getFirstProjectVideo(projectId) {
        return await instance.get(`/projects/${projectId}/video`)
    }
}

export const requestsAPI = {
    async sendRequest(projectId, containerId, formData) {
        return await instance.post(`projects/${projectId}/containers/${containerId}/requests`, formData)
    },
    async getRequests() {
        return await instance.get('/requests')
    }
}

export const settingsAPI = {
    async getSettings() {
        return await instance.get(`/settings`)
    },
    async changeGeneralSettings(formData) {
        return await instance.put(`/settings/general`, formData)
    },
    async changeSecuritySettings(password) {
        return await instance.put(`/settings/security`, {password})
    },
    async changeAvatar(formData) {
        return await instance.put(`/settings/avatar`, formData)
    }
}