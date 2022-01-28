import React, { useEffect, useState } from 'react'
import { Media, Player, controls } from 'react-media-player'
import PlayCircleOutlineOutlinedIcon from '@material-ui/icons/PlayCircleOutlineOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import handleViewport from 'react-in-viewport';
import { connect } from 'react-redux'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useSnackbar } from 'notistack';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';
import { 
  Avatar
} from '@material-ui/core'
import { Form, Formik, Field, FieldArray } from 'formik'

import { strPadLeft } from './../../utils/strPadLeft'
import config from './../../config'
import {i18n} from './../../utils/i18n'
import { projectsAPI, requestsAPI } from './../../api/index'

const {
  Progress,
  SeekBar
} = controls

const Video = (props) => {

  const {
    mediaProps,
    videoInsc,
    madeWith,
    videoPath,
    stopOutOfViewport,
    inViewport,
    forwardedRef,
    loop,
    onVideoPlay,
    lang,
    autoPlay,
    setAreOptionsDisabled,
    setVideoState,
    videoState,
    hasLikedByCurrentUser,
    hasDislikedByCurrentUser, 
    setProjects,
    projects, 
    isAuth, 
    views, 
    likes,
    dislikes,
    projectId,
    username, 
    avatar, 
    login, 
    history, 
    desc,
    currentContainer,
    currentProject,
    match,
    isFormSended, 
    setIsFormSended, 
    setCurrentContainer,
    setIsVideoHasTouched,
    setUser,
    user,
    projectInfo,
    setProjectInfo,
    name
  } = props

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if(inViewport) {
      mediaProps.pause()
    } else {
      mediaProps.pause()
    }
  }, [inViewport])


  const getTimeWithMinutes = (time) => {
    const minutes = Math.floor(time / 60);

    const seconds = time - minutes * 60;

    const hours = Math.floor(time / 3600);
    time = time - hours * 3600;

    const finalTime = strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2)

    return finalTime
  }


  return (
    <>
      <Player playsInline={true} autoPlay={autoPlay} src={videoPath + "#t=0.1"} ref={forwardedRef} className="media-player" 
              onPause={() => {
                if(mediaProps.currentTime === mediaProps.duration) {
                  setVideoState("END")
                  
                } else {
                  setVideoState("PAUSE")
                }
              }}
              onPlay={() => {
                setVideoState("PLAY")
                setIsVideoHasTouched(true)
                if(mediaProps.currentTime === 0.1) {
                  onVideoPlay()
                }
              }}
      />
      {mediaProps.isPlaying ? (
        <div className="media-controls" style={{zIndex: 50}} onClick={() => mediaProps.pause()}>
          <div className="top-controls" onClick={(e) => { e.stopPropagation()}}>
            <div className="control-item">
              {`${getTimeWithMinutes(Math.floor(mediaProps.currentTime))} / ${getTimeWithMinutes(Math.floor(mediaProps.duration))}`}
            </div>
            <div className="control-item clickable">
              <ReplayOutlinedIcon onClick={() => mediaProps.seekTo(0)} />
            </div>
          </div>
          <div className="d-flex desktop-dn" style={{background: 'rgba(0,0,0,0.5)', bottom: '0%', width: '100%', position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} onClick={e => e.stopPropagation()}>
            <div className="media-control-group media-control-group--seek m-0" style={{width: '100%', position: 'absolute', top: '-12px', left: 0}}>
              <Progress className="media-control media-control--progress" />
              <SeekBar className="media-control media-control--seekbar" />
            </div>
            <div className="action-bar" style={{justifyContent: 'center', padding: '2.5% 0'}}>
              <div className='action-bar-item like' style={{padding: '0 10px'}} onClick={async (e) => {
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
                <ThumbUpIcon style={{ color: hasLikedByCurrentUser ? "#5383ff" : "white" }} />
                <p style={{ color: hasLikedByCurrentUser ? "#5383ff" : "white" }}>{likes}</p>
              </div>
              <div className='action-bar-item dislike' style={{padding: '0 10px'}} onClick={async (e) => {
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
                <ThumbDownIcon style={{ color: hasDislikedByCurrentUser ? "#5383ff" : "white" }} />
                <p style={{ color: hasDislikedByCurrentUser ? "#5383ff" : "white" }}>{dislikes}</p>
              </div>
              <div className="action-bar-item comment no-clickable" style={{padding: '0 10px'}}>
                <CommentIcon style={{ color: "white" }} />
                <p style={{ color: "white" }}>0</p>
              </div>
              <div className="action-bar-item views no-clickable" style={{padding: '0 10px'}}>
                <VisibilityIcon style={{ color: "white" }} />
                <p style={{ color: "white" }}>{views}</p>
              </div>
              
              <CopyToClipboard text={`${config.frontendUrl}/public/${projectId}`} onCopy={() => enqueueSnackbar(i18n.publicProjectsList.linkWasCopied[lang], {autoHideDuration: 3000 })}>
                <div className="action-bar-item share" style={{padding: '0 10px'}}>
                  <ShareIcon style={{ color: "white" }} />
                </div>
              </CopyToClipboard>
            </div>
          </div>
          {madeWith ? <a className="made-with" href={config.frontendUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation() }}>{i18n.site.createdOnGilza[lang]}</a> : ''}
        </div>
      ) : videoState !== "END" ? (
          <div className="fade-overlay" style={{zIndex: 50}} onClick={() => {mediaProps.play()}}>
              <div className="play-btn">
                <PlayCircleOutlineOutlinedIcon />
              </div>
              <div className="desktop-dn" style={{position: 'absolute', color: 'white', width: '100%', top: '0', left: '0'}}>
                <div className="d-flex p-2">
                  <div className="avatar pr-2">
                    <Avatar style={{width: '56px', height: '56px'}} className="clickable" alt={username} src={`${config.backendUrl + config.avatarsPath + avatar}`} 
                            onClick={() => history.push(`/users/${login}`)} />
                  </div>
                  <div className="d-flex" style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <div className="username clickable" onClick={() => history.push(`/users/${login}`)}>{username}</div>
                    <div className="nickname clickable" onClick={() => history.push(`/users/${login}`)}>{login}</div>
                  </div>
                  <div className="d-flex ml-auto">
                    <div>
                      5
                      <StarIcon />
                    </div>
                    <div>
                      250
                      <PersonIcon />
                    </div>
                  </div>
                </div>
                <div className='px-2'>
                  {name}
                </div>
              </div>
              <div className="d-flex desktop-dn" style={{top: '62%', width: '100%', position: 'absolute', flexDirection: 'column'}}>
                <div style={{textAlign: 'center', color: 'white'}}>
                  {desc}
                </div>
              </div>
              <div className="d-flex desktop-dn" style={{background: 'rgba(0,0,0,0.5)', bottom: 0, width: '100%', position: 'absolute', justifyContent: 'center'}} onClick={e => e.stopPropagation()}>
                <div className="action-bar" style={{justifyContent: 'center', padding: '2.5% 0'}}>
                  <div className='action-bar-item like' style={{padding: '0 10px'}} onClick={async (e) => {
                    if (!isAuth) {
                      return enqueueSnackbar(i18n.publicProjectsList.authUsersCanLike[lang], { variant: 'error', autoHideDuration: 3000 })
                    }
                    const res = await projectsAPI.estimateProject(projectId, true)
                    console.log(setUser)
                    if(setUser) {
                      setUser({...user, projects: user.projects.map(p => {
                        console.log(p.id)
                        console.log(projectId)
                        console.log(p.id === projectId)
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
                    <ThumbUpIcon style={{ color: hasLikedByCurrentUser ? "#5383ff" : "white" }} />
                    <p style={{ color: hasLikedByCurrentUser ? "#5383ff" : "white" }}>{likes}</p>
                  </div>
                  <div className='action-bar-item dislike' style={{padding: '0 10px'}} onClick={async (e) => {
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
                    <ThumbDownIcon style={{ color: hasDislikedByCurrentUser ? "#5383ff" : "white" }}  />
                    <p style={{ color: hasDislikedByCurrentUser ? "#5383ff" : "white" }}>{dislikes}</p>
                  </div>
                  <div className="action-bar-item comment no-clickable" style={{padding: '0 10px'}} >
                    <CommentIcon style={{ color: "white" }} />
                    <p style={{ color: "white" }}>0</p>
                  </div>
                  <div className="action-bar-item views no-clickable" style={{padding: '0 10px'}} >
                    <VisibilityIcon style={{ color: "white" }} />
                    <p style={{ color: "white" }}>{views}</p>
                  </div>
                  
                  <CopyToClipboard text={`${config.frontendUrl}/public/${projectId}`} onCopy={() => enqueueSnackbar(i18n.publicProjectsList.linkWasCopied[lang], {autoHideDuration: 3000 })}>
                    <div className="action-bar-item share" style={{padding: '0 10px'}} >
                      <ShareIcon style={{ color: "white" }} />
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
              {/* {videoInsc ? <div className={'video-insc'} onClick={(e) => e.stopPropagation()}>{videoInsc}</div> : ''} */}
              {madeWith ? <a className="made-with" href={config.frontendUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation() }}>{i18n.site.createdOnGilza[lang]}</a> : ''}
            </div>
    
        ) : (
          <div className="fade-overlay" style={{zIndex: 50}} onClick={() => {mediaProps.play()}}>
              <div className="play-btn replay" style={{position: 'absolute', top: "15%", left: 'calc(50% - 48px)'}}>
                <ReplayOutlinedIcon onClick={() => {setVideoState('PAUSE');mediaProps.seekTo(0)}} />
              </div>
              <div className="d-flex p-2 desktop-dn" style={{position: 'absolute', color: 'white', width: '100%', top: '0', left: '0'}}>
                <div className="avatar pr-2">
                  <Avatar style={{width: '56px', height: '56px'}} className="clickable" alt={username} src={`${config.backendUrl + config.avatarsPath + avatar}`} 
                          onClick={() => history.push(`/users/${login}`)} />
                </div>
                <div className="d-flex" style={{flexDirection: 'column', justifyContent: 'center'}}>
                  <div className="username clickable" onClick={() => history.push(`/users/${login}`)}>{username}</div>
                  <div className="nickname clickable" onClick={() => history.push(`/users/${login}`)}>{login}</div>
                </div>
                <div className="d-flex ml-auto">
                  <div>
                    5
                    <StarIcon />
                  </div>
                  <div>
                    250
                    <PersonIcon />
                  </div>
                </div>
              </div>
              <div className={`callback desktop-dn`} style={{zIndex: 10}} style={{bottom: 'calc(35px + 5%)', maxHeight: '45%'}}>
                <div className="callback-content">
                  {isFormSended ? <div className="options-wrapper"><div className={'item success'}>{i18n.publicProjectPage.success[lang]}</div></div> : (
                    <>
                      {currentContainer.callbackType === 'options' &&
                        <div className="options-wrapper">
                          {currentContainer.options.filter(opt => Boolean(opt) != Boolean(null)).map(opt => <div key={opt.id} className="item" onClick={() => { setCurrentContainer(currentProject.containers.filter(c => opt.containerLinkId === c.id)[0]); setVideoState('PAUSE') }}>{opt.name}</div>)}
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
                                  <input type="submit" className="btn btn-default mt-0" value={i18n.publicProjectPage.send[lang]} />
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
              <div className="d-flex desktop-dn" style={{background: 'rgba(0,0,0,0.5)', bottom: 0, width: '100%', position: 'absolute', justifyContent: 'center'}} onClick={e => e.stopPropagation()}>
                <div className="action-bar" style={{justifyContent: 'center', padding: '2.5% 0'}}>
                  <div className='action-bar-item like' style={{padding: '0 10px'}} onClick={async (e) => {
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
                    <ThumbUpIcon style={{ color: hasLikedByCurrentUser ? "#5383ff" : "white" }} />
                    <p style={{ color: hasLikedByCurrentUser ? "#5383ff" : "white" }}>{likes}</p>
                  </div>
                  <div className='action-bar-item dislike' style={{padding: '0 10px'}} onClick={async (e) => {
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
                    }
                    
                  }}>
                    <ThumbDownIcon style={{ color: hasDislikedByCurrentUser ? "#5383ff" : "white" }}  />
                    <p style={{ color: hasDislikedByCurrentUser ? "#5383ff" : "white" }}>{dislikes}</p>
                  </div>
                  <div className="action-bar-item comment no-clickable" style={{padding: '0 10px'}} >
                    <CommentIcon style={{ color: "white" }} />
                    <p style={{ color: "white" }}>0</p>
                  </div>
                  <div className="action-bar-item views no-clickable" style={{padding: '0 10px'}} >
                    <VisibilityIcon style={{ color: "white" }} />
                    <p style={{ color: "white" }}>{views}</p>
                  </div>
                  
                  <CopyToClipboard text={`${config.frontendUrl}/public/${projectId}`} onCopy={() => enqueueSnackbar(i18n.publicProjectsList.linkWasCopied[lang], {autoHideDuration: 3000 })}>
                    <div className="action-bar-item share" style={{padding: '0 10px'}} >
                      <ShareIcon style={{ color: "white" }} />
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
              {/* {videoInsc ? <div className={'video-insc'} onClick={(e) => e.stopPropagation()}>{videoInsc}</div> : ''} */}
              {madeWith ? <a className="made-with" href={config.frontendUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation() }}>{i18n.site.createdOnGilza[lang]}</a> : ''}
            </div>
        )}
            
    </>
  )
}

const ViewportedVideo = handleViewport(Video)



const VideoPlayer = (props) => {

  const { 
    videoPath, 
    videoInsc, 
    madeWith,
    stopOutOfViewport, 
    loop, 
    onVideoPlay, 
    lang, 
    setAreOptionsDisabled, 
    autoPlay, 
    setVideoState,
    videoState,
    hasLikedByCurrentUser,
    hasDislikedByCurrentUser, 
    setProjects,
    projects, 
    isAuth, 
    views, 
    likes,
    dislikes,
    projectId,
    username, 
    avatar, 
    login, 
    history, 
    desc,
    currentContainer,
    currentProject,
    match,
    isFormSended, 
    setIsFormSended, 
    setCurrentContainer,
    setIsVideoHasTouched,
    user,
    setUser,
    projectInfo,
    setProjectInfo,
    name
  } = props

  return (
    <Media>
      {mediaProps => (
        <div className="media">
          <ViewportedVideo mediaProps={mediaProps}
            videoInsc={videoInsc} videoPath={videoPath} madeWith={madeWith} stopOutOfViewport={stopOutOfViewport} loop={loop} onVideoPlay={onVideoPlay}
            lang={lang} setAreOptionsDisabled={setAreOptionsDisabled} autoPlay={autoPlay} setVideoState={setVideoState} videoState={videoState}
            hasLikedByCurrentUser={hasLikedByCurrentUser} hasDislikedByCurrentUser={hasDislikedByCurrentUser} setProjects={setProjects} 
            projects={projects} isAuth={isAuth} views={views} likes={likes} dislikes={dislikes} projectId={projectId} username={username} 
            avatar={avatar} login={login} history={history} desc={desc} currentContainer={currentContainer} currentProject={currentProject}
            match={match} isFormSended={isFormSended} setIsFormSended={setIsFormSended} setCurrentContainer={setCurrentContainer} 
            setIsVideoHasTouched={setIsVideoHasTouched} user={user} setUser={setUser} projectInfo={projectInfo} setProjectInfo={setProjectInfo}
            name={name} />
        </div>
      )}
    </Media>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang
})

export default connect(mstp)(VideoPlayer)
