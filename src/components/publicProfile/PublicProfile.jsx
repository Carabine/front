import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux'
import { Avatar } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Grid,
  Fab,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Tooltip,
  Container,
  Divider
} from '@material-ui/core';

import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';

import { usersAPI, projectsAPI } from './../../api/index'
import config from './../../config'
import PublicProject from './../publicProject/PublicProject'
import { i18n } from './../../utils/i18n'


const PublicProfile = (props) => {
  const {
    lang,
    isAuth,
    history
  } = props

  const [user, setUser] = useState({username: '', avatar: '', login: '', about: '', projects: []})
  const [hasMore, setHasMore] = useState(true)
  const [projectsNotFoundMessageHasShown, setProjectsNotFoundMessageHasShown] = useState(false)

  useEffect(() => {
    if(user.username && user.login) {
      document.title = `${user.login} ${user.username} ${i18n.site.profile[lang]}`
      
    }
  }, [user.username, user.login, document.title])

  useEffect(() => {
    
  }, [user.about, lang])  

  const getProjectsElem = (user) => {
    return user.projects.map(p => {
      if(p.containers && p.containers.length) {
        return <Project key={p.id} projectId={p.id} estimates={p.estimates}
                        userEstimate={p.userEstimates && p.userEstimates.length && p.userEstimates[0]} username={user.username} 
                        avatar={user.avatar} login={user.login} desc={p.desc} history={history} setUser={setUser} user={user} isAuth={isAuth} 
                        lang={lang} name={p.name} views={p.views} />
      }
    })
  }

  const { enqueueSnackbar } = useSnackbar()

  return (
    <Fragment>
      <Grid container className="public-profile-page" flexDirection='column'> 
        <Grid item xs={12} lg={12} flexDirection='column'>
          <div className="bg-midnight-bloom p-3 text-white d-flex" style={{flexDirection: 'column'}}>
            <Grid item container xs={12}>
              <Grid item container md={3} xs={12} flexDirection="row" style={{flexDirection: 'row', flexWrap: 'nowrap'}} >
                <Grid item className="align-items-center d-flex py-3">
                  <div className="d-flex align-items-start justify-content-between" >
                    <div className="avatar-icon-wrapper d-44">
                      <span className="badge-circle badge badge-success" style={{zIndex: 1}}>Online</span>
                      <div className="avatar-icon d-44">
                      <Avatar style={{width: '44px', height: '44px'}} className="clickable" alt={user.username} 
                              src={`${config.backendUrl + config.avatarsPath + user.avatar}`} />
                      </div>
                    </div>
                  </div>
                  </Grid>
                <Grid item className="d-flex align-items-center ml-2"> 
                  <div className="h-auto">
                    <p className="font-weight-bold font-size-lg mt-2 mb-0">{user.username}</p>
                    <p className="font-size-md text-white-50">{user.login}</p>
                  </div>
                </Grid>
              </Grid>
              <Grid item className="align-items-center w-auto d-flex h-auto w-xs-100 p-md-0 pb-3">
                <Grid container className="text-center">
                  {/* <Grid xs={4} item>
                    <b className="d-block font-weight-bold font-size-lg">456</b>
                    <small className="text-uppercase text-white-50">
                      friends
                    </small>
                  </Grid> */}
                  <Grid item className="pr-3" style={{padding: 0}}>
                    <b className="d-block font-weight-bold font-size-lg">{user.projects.length}</b>
                    <small className="text-uppercase text-white-50">
                      projects
                    </small>
                  </Grid>
                  <Grid item style={{padding: 0}}>
                    <b className="d-block font-weight-bold font-size-lg">15</b>
                    <small className="text-uppercase text-white-50">
                      followers
                    </small>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container xs={12} md={4} className="ml-auto">
                <Button
                  size="medium"
                  variant="contained"
                  color="default"
                  className="mr-3 ml-md-auto my-auto">
                  Send message
                </Button>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  className="my-auto">
                  Subscribe
                </Button>
              </Grid>
            </Grid>
            <Grid container item xs={12} className="pt-md-2 pt-4">
              <Divider className="w-100" style={{background: 'rgba(255, 255, 255, 0.5)'}} />
              <p className="text-white-50 mb-0 pt-2 pb-1">
                {user.about}
              </p>
            </Grid>
            
            {/* <div className="font-weight-bold font-size-lg d-flex align-items-center mb-3">
              <span>Followers</span>
              <div className="ml-auto font-size-xs">
                <Tooltip arrow title="Add new subscriber">
                  <a
                    href="#/"
                    onClick={e => e.preventDefault()}
                    className="text-white">
                    <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                  </a>
                </Tooltip>
              </div>
            </div> */}
            {/* <div className="py-2">
              <div className="align-box-row">
                <a
                  href="#/"
                  onClick={e => e.preventDefault()}
                  className="avatar-icon-wrapper avatar-icon-md text-white">
                  <span className="badge-circle badge badge-success">
                    Online
                  </span>
                  <div className="avatar-icon rounded-circle">
                    <img alt="..." src={avatar1} />
                  </div>
                </a>
                <div className="pl-2">
                  <span className="d-block">
                    <a
                      href="#/"
                      onClick={e => e.preventDefault()}
                      className="text-white">
                      Adella Galen
                    </a>
                    <small className="d-block text-white-50">
                      (Galen@example.com)
                    </small>
                  </span>
                </div>
              </div>
            </div>
            <div className="py-2">
              <div className="align-box-row">
                <a
                  href="#/"
                  onClick={e => e.preventDefault()}
                  className="avatar-icon-wrapper avatar-icon-md text-white">
                  <div className="badge badge-primary badge-circle">
                    Offline
                  </div>
                  <div className="avatar-icon rounded-circle">
                    <img alt="..." src={avatar2} />
                  </div>
                </a>
                <div className="pl-2">
                  <span className="d-block">
                    <a
                      href="#/"
                      onClick={e => e.preventDefault()}
                      className="text-white">
                      Mandy Erle
                    </a>
                    <small className="d-block text-white-50">
                      (Mandyrle@gma.com)
                    </small>
                  </span>
                </div>
              </div>
            </div> */}
            {/* <div className="py-2">
              <div className="align-box-row">
                <a
                  href="#/"
                  onClick={e => e.preventDefault()}
                  className="avatar-icon-wrapper avatar-icon-md text-white">
                  <span className="badge-circle badge badge-success">
                    Online
                  </span>
                  <div className="avatar-icon rounded-circle">
                    <img alt="..." src={avatar3} />
                  </div>
                </a>
                <div className="pl-2">
                  <span className="d-block">
                    <a
                      href="#/"
                      onClick={e => e.preventDefault()}
                      className="text-white">
                      John Doe
                    </a>
                    <small className="d-block text-white-50">
                      (Galen@example.com)
                    </small>
                  </span>
                </div>
              </div>
            </div>
            <div className="py-2">
              <div className="align-box-row">
                <a
                  href="#/"
                  onClick={e => e.preventDefault()}
                  className="avatar-icon-wrapper avatar-icon-md text-white">
                  <span className="badge-circle badge badge-warning">Idle</span>
                  <div className="avatar-icon rounded-circle">
                    <img alt="..." src={avatar4} />
                  </div>
                </a>
                <div className="pl-2">
                  <span className="d-block">
                    <a
                      href="#/"
                      onClick={e => e.preventDefault()}
                      className="text-white">
                      Napoleon Stacey
                    </a>
                    <small className="d-block text-white-50">
                      (Napoleon@test.com)
                    </small>
                  </span>
                </div>
              </div>
            </div> */}
            {/* <div className="divider opacity-2 my-4" />
            <div className="font-weight-bold font-size-lg d-flex align-items-center mb-3">
              <span>Mutual connections</span>
            </div>
            <div className="py-2">
              <div className="avatar-wrapper-overlap mb-3">
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img alt="..." src={avatar1} />
                  </div>
                </div>
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img alt="..." src={avatar7} />
                  </div>
                </div>
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img alt="..." src={avatar1} />
                  </div>
                </div>
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img alt="..." src={avatar2} />
                  </div>
                </div>
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img alt="..." src={avatar6} />
                  </div>
                </div>
              </div>
            </div> */}
            {/* <small className="text-white-50">
              <b className="d-block pb-1 text-white-50">
                You have 25 mutual connections
              </b>
              You and John both know Kate Erle, Napoleon Stacey, and 23 others
            </small> */}
          </div>
        </Grid>
        <Grid item xs={12} lg={8} className="p-sm-3 p-0">
          <div className="public-projects-list-page">
          <InfiniteScroll
                pageStart={0}
                className="infinity-scroll"
                loadMore={async (page) => {
                    try {
                        const res = await usersAPI.getPublicUserData(props.match.params.login, 2, user.projects.length)
                        if(!res.data.user) {
                            return enqueueSnackbar(i18n.publicProfile.userNotFound[lang], { variant: 'error', autoHideDuration: 3000 })
                        }

                        if(!projectsNotFoundMessageHasShown && !res.data.projects.length) {
                          enqueueSnackbar(i18n.publicProjectsList.projectsNotFound[lang], { variant: 'error', autoHideDuration: 3000 })
                        } 
                        
                        setProjectsNotFoundMessageHasShown(true)

                        setUser({...user, ...res.data.user, projects: [...user.projects, ...res.data.projects]})
                        if(res.data.count === user.projects.length) {
                            setHasMore(false)
                        }
                    } catch(err) {
                        console.log(err)
                        enqueueSnackbar(i18n.publicProfile.errorLoadingProfile[lang], { variant: 'error', autoHideDuration: 3000 })

                    }

                }}
                hasMore={hasMore}
            >
                {user.projects.length ? getProjectsElem(user) : ''}
            </InfiniteScroll>
          </div>
        </Grid>
      </Grid>
      <div className="sidebar-inner-layout-overlay" />
    </Fragment>
  );
}



const Project = ({projectId, estimates, userEstimate, username, avatar, login, history, desc, setUser, user, isAuth, lang, name, views}) => {
  const { enqueueSnackbar } = useSnackbar()

  let likes = 0
  let dislikes = 0

  estimates.forEach(e => {
      if(e.isLike) {
          likes++
      } else {
          dislikes++
      }
  })

  let hasLikedByCurrentUser = false
  let hasDislikedByCurrentUser = false

  if(userEstimate && projectId === userEstimate.Estimate.projectId) {
      if(userEstimate.Estimate.isLike) {
          hasLikedByCurrentUser = true
      } else {
          hasDislikedByCurrentUser = true
      }
  }
  console.log(setUser)
  return <PublicProject likes={likes} dislikes={dislikes} hasLikedByCurrentUser={hasLikedByCurrentUser} hasDislikedByCurrentUser={hasDislikedByCurrentUser} 
                        projectId={projectId} embed={true} username={username} avatar={avatar} login={login} history={history} desc={desc} 
                        user={user} setUser={setUser} isAuth={isAuth} lang={lang} name={name} views={views} 
                         />
}

const mstp = (state) => ({
  lang: state.auth.lang,
  isAuth: state.auth.isAuth
})

export default withRouter(connect(mstp, null)(PublicProfile));
