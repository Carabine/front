import React, { useState, useLayoutEffect } from 'react'
import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Formik, Field, FieldArray } from 'formik'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import { 
  Avatar
} from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { i18n } from './../../utils/i18n'
import { projectsAPI, requestsAPI } from '../../api/index'
import VideoPlayer  from './../common/VideoPlayer'
import config from './../../config'

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const PublicProject = (props) => {
  const { 
    match, 
    location, 
    embed, 
    projectId, 
    lang, 
    username, 
    avatar, 
    login, 
    history, 
    desc, 
    setProjects, 
    projects, 
    isAuth, 
    name, 
    views, 
    likes,
    dislikes, 
    hasLikedByCurrentUser, 
    hasDislikedByCurrentUser,
    setUser,
    user,
    projectInfo,
    setProjectInfo
  } = props
  

  const [currentContainer, setCurrentContainer] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)
  const [isFormSended, setIsFormSended] = useState(false)
  const [isVideoHasTouched, setIsVideoHasTouched] = useState(false)
  const [videoState, setVideoState] = useState('PAUSE')

  const [width, height] = useWindowSize()

  useEffect(() => {    
    projectsAPI.getPublicProject(projectId ? projectId : match.params.projectId)
      .then(res => {
        setCurrentProject(res.data)
        setCurrentContainer(res.data.containers[0])

      })
  }, [match.params.containerId])

  useEffect(() => {
   // console.log(projectId)
    if(!projectId) {
      projectsAPI.getProjectMeta(match.params.projectId)
        .then(res => {
          const data = res.data
          document.title = `${data.login} - ${data.name}`
          var meta=document.getElementsByTagName("meta");
          if(data.desc) {
            for (var i=0; i<meta.length; i++) {
              if (meta[i].name.toLowerCase() == "description") {
                  meta[i].content = data.desc
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [match.params.projectId])

  if(document.title === 'Gilza') {
    projectsAPI.getProjectMeta(match.params.projectId)
      .then(res => {
        const data = res.data
        document.title = `${data.login} - ${data.name}`
        var meta=document.getElementsByTagName("meta");
        if(data.desc) {
          for (var i=0; i<meta.length; i++) {
            if (meta[i].name.toLowerCase() == "description") {
                meta[i].content = data.desc
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
  }


  const { enqueueSnackbar } = useSnackbar();

  const onVideoPlay = async () => {
    await projectsAPI.incProjectViews(projectId ? projectId : match.params.projectId)
  }


   

  if(!match.params.projectId || width < 769) {
    return <div className={`public-project-item ${match.params.projectId ? 'single-project' : ''}`}>
    <div className="content-wrapper">
        <div className="project-header mobile-dn">
          <div className="user-info">
            <div className="avatar">
              <Avatar style={{width: '56px', height: '56px'}} className="clickable" alt={username} src={`${config.backendUrl + config.avatarsPath + avatar}`} 
                      onClick={() => history.push(`/users/${login}`)} />
            </div>
            <div className="user-info-text">
              <div className="username clickable" onClick={() => history.push(`/users/${login}`)}>{username}</div>
              <div className="nickname clickable" onClick={() => history.push(`/users/${login}`)}>{login}</div>
            </div>
          </div>
          <div className="project-info">
              <a style={{color: 'inherit', display: 'block'}} className="project-name clickable mt-2" target="_black" href={`${config.frontendUrl}/public/${projectId}`}>{name}</a>
              <div className="desc">{desc}</div>
          </div>
        </div>
      
      <div className="gilza-embed-container gilza-public-projects-list w-100">
        <div className={`public-container-page preview-column ${location.search.match(/embed/) || embed ? 'embed' : ''}`}>
          {currentContainer && (
            <div className="public-container-content">
              <div className="site">
                <div className="frames">
                
                  <div className="video-wrapper">
                    <VideoPlayer key={currentContainer && currentContainer.id}
                    videoPath={currentContainer && currentContainer.video && `${config.protocol}://${currentContainer.video.domain + config.videosPath + currentContainer.video.fileName}`} 
                    videoInsc={currentContainer.videoInsc} madeWith={false} stopOutOfViewport={embed} loop={true} onVideoPlay={onVideoPlay}
                    autoPlay={isVideoHasTouched} setVideoState={setVideoState} videoState={videoState}
                    hasLikedByCurrentUser={hasLikedByCurrentUser} hasDislikedByCurrentUser={hasDislikedByCurrentUser} setProjects={setProjects} 
                    projects={projects} isAuth={isAuth} views={views} likes={likes} dislikes={dislikes} projectId={projectId} username={username} 
                    avatar={avatar} login={login} history={history} desc={desc} currentContainer={currentContainer} currentProject={currentProject}
                    match={match} isFormSended={isFormSended} setIsFormSended={setIsFormSended} setCurrentContainer={setCurrentContainer}
                    setIsVideoHasTouched={setIsVideoHasTouched} setUser={setUser} user={user} projectInfo={projectInfo}
                    setProjectInfo={setProjectInfo} name={name} />
                  </div>
                    <div className={`callback mobile-dn`} style={{zIndex: 10}}>
                      <div className="callback-content">
                        {isFormSended ? <div className="options-wrapper"><div className={'item success'}>{i18n.publicProjectPage.success[lang]}</div></div> : (
                          <>
                            {currentContainer.callbackType === 'options' &&
                              <div className="options-wrapper">
                                {currentContainer.options.filter(opt => Boolean(opt) != Boolean(null)).map(opt => <div key={opt.id} className="item" onClick={() => { setCurrentContainer(currentProject.containers.filter(c => opt.containerLinkId === c.id)[0]) }}>{opt.name}</div>)}
                              </div>
                            }

                            {currentContainer.callbackType === 'formItems' &&
                              <div className="form-wrapper">
                                <Formik
                                  initialValues={{ formItems: currentContainer.form.formItems.map(item => ({ ...item, value: '' })) }}
                                  onSubmit={async (values) => {
                                    if (values.formItems.filter(item => item.value).length === 0) {
                                      return enqueueSnackbar(i18n.publicProjectPage.fillOneField[lang], { variant: 'error', autoHideDuration: 3000 });
                                    }
                                    await requestsAPI.sendRequest(match.params.projectId, currentContainer.id, values)
                                    setIsFormSended(true)
                                  }}
                                >
                                  {(formik) => (
                                    <Form>
                                      <div className="custom-form">
                                        <FieldArray name='options' render={(fieldHelper) => (
                                          formik.values.formItems.map((item, index) => (
                                            <div key={item.id} className="field-container">
                                              <Field name={`formItems.${index}.value`} placeholder={item.name} />
                                            </div>
                                          ))
                                        )} >
                                        </FieldArray>
                                        <input type="submit" className="btn btn-default" value={i18n.publicProjectPage.send[lang]} />
                                      </div>
                                    </Form>
                                  )}
                                </Formik>
                              </div>
                            }
                          </>
                        )}
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
        <div className="action-bar mobile-dn">
          <div className='action-bar-item like' onClick={async () => {
            if (!isAuth) {
              return enqueueSnackbar(i18n.publicProjectsList.authUsersCanLike[lang], { variant: 'error', autoHideDuration: 3000 })
            }
            const res = await projectsAPI.estimateProject(projectId, true)
            if(setUser) {
              setUser({...user, projects: user.projects.map(p => {
                if(p.id === projectId) {
                    return {...p, ...res.data}
                }
                return p
              })})
            } else if(setProjects) {
              setProjects(projects.map(p => {
                if (p.id === projectId) {
                  return { ...p, ...res.data }
                }
                return p
              }))
            } else if(setProjectInfo) {
              setProjectInfo({...projectInfo, project: {...projectInfo.project, ...res.data}})
            }
          }}>
            <ThumbUpIcon style={{ color: hasLikedByCurrentUser ? "#263055" : "#909090" }} />
            <p style={{ color: hasLikedByCurrentUser ? "#263055" : "#909090" }}>{likes}</p>
          </div>
          <div className='action-bar-item dislike' onClick={async () => {
            if (!isAuth) {
              return enqueueSnackbar(i18n.publicProjectsList.authUsersCanLike[lang], { variant: 'error', autoHideDuration: 3000 })
            }
            const res = await projectsAPI.estimateProject(projectId, false)
            if(setUser) {
              setUser({...user, projects: user.projects.map(p => {
                if(p.id === projectId) {
                    return {...p, ...res.data}
                }
                return p
              })})
            } else if(setProjects) {
              setProjects(projects.map(p => {
                if (p.id === projectId) {
                  return { ...p, ...res.data }
                }
                return p
              }))
            } else if(setProjectInfo) {
              setProjectInfo({...projectInfo, project: {...projectInfo.project, ...res.data}})
            }
          }}>
            <ThumbDownIcon style={{ color: hasDislikedByCurrentUser ? "#263055" : "#909090" }} />
            <p style={{ color: hasDislikedByCurrentUser ? "#263055" : "#909090" }}>{dislikes}</p>
          </div>
          <div className="action-bar-item comment no-clickable">
            <CommentIcon style={{ color: "#909090" }} />
            <p style={{ color: "#909090" }}>0</p>
          </div>
          <div className="action-bar-item views no-clickable">
            <VisibilityIcon style={{ color: "#909090" }} />
            <p style={{ color: "#909090" }}>{views}</p>
          </div>
          
          <CopyToClipboard text={`${config.frontendUrl}/public/${projectId}`} onCopy={() => enqueueSnackbar(i18n.publicProjectsList.linkWasCopied[lang], {autoHideDuration: 3000 })}>
            <div className="action-bar-item share">
              <ShareIcon style={{ color: "#909090" }} />
            </div>
          </CopyToClipboard>
        </div>
    </div>
  </div>
  } else {
    return <div className={`public-container-page preview-column ${match.params.projectId ? 'single-project-pc' : ''} ${location.search.match(/embed/) || embed ? 'embed' : ''}`}>
    {currentContainer && (
      <div className="public-container-content">
        <div className="site">
          <div className="frames">
            
            <div className="video-wrapper">
              <VideoPlayer key={currentContainer && currentContainer.id}
              videoPath={currentContainer && currentContainer.video && `${config.protocol}://${currentContainer.video.domain + config.videosPath + currentContainer.video.fileName}`} 
              videoInsc={currentContainer.videoInsc} madeWith={false} stopOutOfViewport={embed} loop={true} onVideoPlay={onVideoPlay}
              autoPlay={isVideoHasTouched} setVideoState={setVideoState} videoState={videoState}
              hasLikedByCurrentUser={hasLikedByCurrentUser} hasDislikedByCurrentUser={hasDislikedByCurrentUser} setProjects={setProjects} 
              projects={projects} isAuth={isAuth} views={views} likes={likes} dislikes={dislikes} projectId={projectId} username={username} 
              avatar={avatar} login={login} history={history} desc={desc} currentContainer={currentContainer} currentProject={currentProject}
              match={match} isFormSended={isFormSended} setIsFormSended={setIsFormSended} setCurrentContainer={setCurrentContainer}
              setIsVideoHasTouched={setIsVideoHasTouched} setUser={setUser} user={user} isNewPlayer={true} name={name} />
            </div>
              <div className={`callback mobile-dn`} style={{zIndex: 10}}>
                <div className="callback-content">
                  {isFormSended ? <div className="options-wrapper"><div className={'item success'}>{i18n.publicProjectPage.success[lang]}</div></div> : (
                    <>
                      {currentContainer.callbackType === 'options' &&
                        <div className="options-wrapper">
                          {currentContainer.options.filter(opt => Boolean(opt) != Boolean(null)).map(opt => <div key={opt.id} className="item" onClick={() => { setCurrentContainer(currentProject.containers.filter(c => opt.containerLinkId === c.id)[0]) }}>{opt.name}</div>)}
                        </div>
                      }

                      {currentContainer.callbackType === 'formItems' &&
                        <div className="form-wrapper">
                          <Formik
                            initialValues={{ formItems: currentContainer.form.formItems.map(item => ({ ...item, value: '' })) }}
                            onSubmit={async (values) => {
                              if (values.formItems.filter(item => item.value).length === 0) {
                                return enqueueSnackbar(i18n.publicProjectPage.fillOneField[lang], { variant: 'error', autoHideDuration: 3000 });
                              }
                              await requestsAPI.sendRequest(match.params.projectId, currentContainer.id, values)
                              setIsFormSended(true)
                            }}
                          >
                            {(formik) => (
                              <Form>
                                <div className="custom-form">
                                  <FieldArray name='options' render={(fieldHelper) => (
                                    formik.values.formItems.map((item, index) => (
                                      <div key={item.id} className="field-container">
                                        <Field name={`formItems.${index}.value`} placeholder={item.name} />
                                      </div>
                                    ))
                                  )} >
                                  </FieldArray>
                                  <input type="submit" className="btn btn-default" value={i18n.publicProjectPage.send[lang]} />
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      }
                    </>
                  )}
                </div>
              </div>
          </div>
        </div>
      </div>
    )}
  </div>
  }
  
}

const mstp = (state) => ({
  lang: state.auth.lang
})

export default withRouter(connect(mstp, null)(PublicProject))
