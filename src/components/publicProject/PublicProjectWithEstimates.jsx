import React, { useEffect, useState } from 'react'
import { projectsAPI } from './../../api/index'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PublicProject from './PublicProject'

const Project = (props) => {
    const { isAuth, lang, history, match } = props
    const { projectId } = match.params
    const [projectInfo, setProjectInfo] = useState({user: {}, project: {}})


    useEffect(() => {
        projectsAPI.getProjectInfo(projectId)
            .then(res => {
                setProjectInfo(res.data)
            })
    }, [projectId])


    let likes = 0
    let dislikes = 0
    
    let hasLikedByCurrentUser = false
    let hasDislikedByCurrentUser = false

    console.log('==========')
    console.log(hasLikedByCurrentUser)
    console.log(hasDislikedByCurrentUser)
    console.log('==========')
    
    const {username, avatar, login} = projectInfo.user
    const {estimates, userEstimates, desc, name, views} = projectInfo.project
        

    const userEstimate = userEstimates && userEstimates[0]

    if(estimates) {
        estimates.forEach(e => {
            if (e.isLike) {
              likes++
            } else {
              dislikes++
            }
        })
    }
    
    
    if (userEstimate && projectId === userEstimate.Estimate.projectId) {
      if (userEstimate.Estimate.isLike) {
        hasLikedByCurrentUser = true
      } else {
        hasDislikedByCurrentUser = true
      }
    }
  
    return <PublicProject likes={likes} dislikes={dislikes} hasLikedByCurrentUser={hasLikedByCurrentUser} hasDislikedByCurrentUser={hasDislikedByCurrentUser} 
                          projectId={projectId} embed={true} username={username} avatar={avatar} login={login} history={history} desc={desc} 
                          setProjectInfo={setProjectInfo} projectInfo={projectInfo} isAuth={isAuth} lang={lang} name={name} views={views} />
  }
  
  
const mstp = (state) => ({
lang: state.auth.lang,
isAuth: state.auth.isAuth
})

export default withRouter(connect(mstp, null)(Project))