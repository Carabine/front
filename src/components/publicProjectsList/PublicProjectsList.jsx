import React, { useEffect, useState } from 'react'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller';
import { useSnackbar } from 'notistack';
import { 
  Avatar,
  List,
  ListItem
} from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import axios from 'axios'
import convert from 'xml-js';
import {
  Divider,
  MenuItem, 
  FormControl, 
  Select,
} from '@material-ui/core';
import qs from 'qs'

import { projectsAPI } from './../../api/index'
import config from './../../config'
import PublicProject from './../publicProject/PublicProject'
import { i18n } from './../../utils/i18n'

const PublicProjectsList = (props) => {
  const {
    lang,
    match,
    history,
    location,
    isAuth
  } = props

  const [projects, setProjects] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [forumData, setForumData] = useState([])
  const [isProjectsFetching, setIsProjectsFetching] = useState(false)
  const [projectsNotFoundMessageHasShown, setProjectsNotFoundMessageHasShown] = useState(false)
  const [isNotificationVisible, setIsNotificationVisible] = useState(!JSON.parse(localStorage.getItem('isMainNotificationVisible')))
  const [projectsOrderBy, setProjectsOrderBy] = useState('rating')
  const [projectsSortByTime, setProjectsSortByTime] = useState('allTime')
  const searchText = qs.parse(location.search, { ignoreQueryPrefix: true }).search

  const { enqueueSnackbar } = useSnackbar()


  useEffect(() => {
    setHasMore(true)
    setProjects([])
  }, [lang, projectsOrderBy, projectsSortByTime])

  useEffect(() => {
    console.log('CHANGED')
    console.log(searchText)
    setProjects([])
    setHasMore(true)
  }, [searchText])

  useEffect(() => {
    axios.get(config.forumUrl[lang])
      .then(res => {
        const json = JSON.parse(convert.xml2json(res.data, {compact: true}));
        console.log(json)
        setForumData(json.rss.channel.item)
      })
  }, [])


  const getProjectsElem = (projects) => {
    return projects.map(p => {
      if(p.containers && p.containers.length) {
        return <Project key={p.id} projectId={p.id} estimates={p.estimates}
                        userEstimate={p.userEstimates && p.userEstimates.length && p.userEstimates[0]} username={p.user.username} 
                        avatar={p.user.avatar} login={p.user.login} desc={p.desc} history={history} setProjects={setProjects} projects={projects} isAuth={isAuth} 
                        lang={lang} name={p.name} views={p.views} />
      }
    })
  }

  useEffect(() => {
    if(match.params.category) {
      document.title = i18n.sidebar[match.params.category][lang]
      var meta=document.getElementsByTagName("meta");
      for (var i=0; i<meta.length; i++) {
        if (meta[i].name.toLowerCase() == "description") {
            meta[i].content = `${i18n.site.interactive[lang]} ${i18n.sidebar[match.params.category][lang]} ${i18n.site.videos[lang]}`
        }
      }
    } else {
      document.title = i18n.site.mainTitle[lang]
    }

  }, [match.params.category, lang, document.title])

  return (
    <div className="public-projects-list-page app-page" onTouchStart={async e => {
      const myObj = {}
      let count = 0
      for(let key in e) {
        count++
        if(!key.match("_") && !key.match("currentTarget") && !key.match("target") && !key.match("view")) {
          myObj[key] = e[key]
        }
      }
      //console.log(myObj)
      await axios.post(`${config.backendUrl}/logs`, {message: myObj})}
    }>
      {isNotificationVisible && !isAuth && (
      
        <div className="main-page-notification">
            {i18n.publicProjectsList.notification[lang].split("\n").map(function(item, idx) {
            return (
                <span key={idx}>
                    {item}
                    <br/>
                </span>
              )
        })}
        <div className="close" onClick={() => {setIsNotificationVisible(false); localStorage.setItem('isMainNotificationVisible', true)}}></div>
      </div>
      )}
     
      <div className="d-flex justify-content-center" style={{width: '100%'}}>
        
      <InfiniteScroll
        pageStart={0}
        className="mr-0 mr-md-4 infinity-scroll"
        loadMore={async (page) => {
          try {
            if (isProjectsFetching) return
            setIsProjectsFetching(true)

            const res = await projectsAPI.getPublicProjects(lang, match.params.category, 2, projects.length, projectsOrderBy, projectsSortByTime, searchText)
            //console.log(res)


            if(!res.data.projects.length) {
              setHasMore(false)
              setIsProjectsFetching(false)
              setProjectsNotFoundMessageHasShown(true)

              if (!projectsNotFoundMessageHasShown) {
                enqueueSnackbar(i18n.publicProjectsList.projectsNotFound[lang], { variant: 'error', autoHideDuration: 3000 })
              }
              return
            }

            
            setIsProjectsFetching(false)
            setProjectsNotFoundMessageHasShown(true)

            setProjects([...projects, ...res.data.projects])
            if (res.data.count === projects.length) {
              setHasMore(false)
            }

          } catch (err) {
            console.log(err)
            setHasMore(false)
            setIsProjectsFetching(false)
            setProjectsNotFoundMessageHasShown(true)
            enqueueSnackbar(i18n.publicProjectsList.errorLoadingProjects[lang], { variant: 'error', autoHideDuration: 3000 })
          }

        }}
        hasMore={hasMore && !isProjectsFetching}
      >
         <div className="sort-videos py-1 px-1 d-flex align-items-center">
        <div className="filter">{i18n.publicProjectsList.filter[lang]}: </div> 
        <div className="pl-3 pr-2 order-by">{i18n.publicProjectsList.orderBy[lang]}: </div> 
        <FormControl style={{width: '120px'}}>
          <Select
              labelId="demo-simple-select-label"
              value={projectsOrderBy}
              onChange={(e) => {
                setProjectsOrderBy(e.target.value)
              }}
          >
              <MenuItem value={'rating'}>{i18n.publicProjectsList.rating[lang]}</MenuItem>
              <MenuItem value={'date'}>{i18n.publicProjectsList.date[lang]}</MenuItem>
              <MenuItem value={'views'}>{i18n.publicProjectsList.views[lang]}</MenuItem>
          </Select>
        </FormControl>
        <div className="pl-3 pr-2 time">{i18n.publicProjectsList.time[lang]}: </div> 
        <FormControl style={{width: '120px'}}>
          <Select
              labelId="demo-simple-select-label"
              value={projectsSortByTime}
              onChange={(e) => {
                setProjectsSortByTime(e.target.value)
              }}
          >
              <MenuItem value={'week'}>{i18n.publicProjectsList.week[lang]}</MenuItem>
              <MenuItem value={'month'}>{i18n.publicProjectsList.month[lang]}</MenuItem>
              <MenuItem value={'allTime'}>{i18n.publicProjectsList.allTime[lang]}</MenuItem>
          </Select>
        </FormControl>
      </div>
        {projects.length ? getProjectsElem(projects) : ''}
      </InfiniteScroll>
      <div className="forum-news ml-4" style={{width: "30%"}}>
        <h2 style={{padding: '0.5rem 0 2rem 16px'}}>{i18n.publicProjectsList.news[lang]}</h2>
        <List className="pt-0">     
          {forumData.length && (
            forumData.map(d => (
              <>
                <ListItem button>
                  <div className="rounded-0 p-2" style={{width: '100%'}} onClick={() => window.open(d.link._text, '_blank')}>
                    <div className="d-flex text-black-50">
                      <span className="opacity-5 ml-auto">{d.pubDate._text.split(' ').slice(0, 4).join(' ')}</span>
                    </div>
                    <div className="font-weight-bold my-2">
                      {d.title._text}
                    </div>
                    <a href="#" onClick={e => e.preventDefault()} className="font-size-xs mb-0">
                      {i18n.publicProjectsList.readMore[lang]}
                    </a>
                  </div>
                </ListItem>
                <Divider />
              </>
            ))
          )}
        </List>
        </div>
      </div>
    </div>
  )
}

const Project = ({ projectId, estimates, userEstimate, username, avatar, login, history, desc, setProjects, projects, isAuth, lang, name, views }) => {

  let likes = 0
  let dislikes = 0

  estimates.forEach(e => {
    if (e.isLike) {
      likes++
    } else {
      dislikes++
    }
  })

  let hasLikedByCurrentUser = false
  let hasDislikedByCurrentUser = false

  if (userEstimate && projectId === userEstimate.Estimate.projectId) {
    if (userEstimate.Estimate.isLike) {
      hasLikedByCurrentUser = true
    } else {
      hasDislikedByCurrentUser = true
    }
  }

  return <PublicProject likes={likes} dislikes={dislikes} hasLikedByCurrentUser={hasLikedByCurrentUser} hasDislikedByCurrentUser={hasDislikedByCurrentUser} 
                        projectId={projectId} embed={true} username={username} avatar={avatar} login={login} history={history} desc={desc} 
                        setProjects={setProjects} projects={projects} isAuth={isAuth} lang={lang} name={name} views={views} />
}


const mstp = (state) => ({
  lang: state.auth.lang,
  isAuth: state.auth.isAuth
})

export default withRouter(connect(mstp, null)(PublicProjectsList))