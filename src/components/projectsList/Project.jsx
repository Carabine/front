import React from 'react'
import * as locale from 'date-fns/locale'
import { formatRelative } from 'date-fns'
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Grid,
  Fab,
  Card,
  CardContent,
} from '@material-ui/core';

import config from './../../config'
import { i18n } from './../../utils/i18n'


export const Project = (props) => {
  const {
    id,
    name,
    deleteProject,
    domain,
    fileName,
    desc,
    created,
    lang,
    history,
    estimates,
    views
  } = props

  let likes = 0

  if(estimates) {
    estimates.forEach(e => {
      if (e.isLike) {
        likes++
      }
    })
  }

  return (
    <Grid item xs={10} sm={6} md={4} lg={3} className='project-item'>
      <Card className="card-box mb-4">
        <CardContent className="p-3">
          <div className="card-img-wrapper">
          <div className="card-badges card-badges-top" onClick={(e) => {e.stopPropagation(); deleteProject(id)}} style={{top: 0, right: 0}}>
              <Fab color="primary" size="small">
                <DeleteIcon />
              </Fab>
            </div>
            <div className="video-name">
              <div className="text">
                <b>{name}</b>
              </div>
            </div>
            <small>
              {`${i18n.mediafilesPage.uploadOn[lang]}: `}
              <span className="text-black-50">{created ? formatRelative(new Date(Number(created)), new Date(), { locale: lang != 'en' ? locale[lang] : '' }) : ''}</span>
            </small>
            <div className="video-wrapper rounded mb-2 mt-2 bg-secondary d-flex align-items-center align-content-center video-picture clickable"
              onClick={() => {history.push(`/projects/${id}`)}} style={{ paddingBottom: '120%', height: 0, position: 'relative' }}>

              <video src={fileName ? `${config.protocol}://${domain + config.videosPath + fileName}` : ''} style={{position: 'absolute', width: '100%', height: '100%', top: 0, objectFit: 'cover'}} autoPlay muted loop></video>
            </div>
            <div>
              <Grid>
              <span className="text-black-50 pb-2">
                <ThumbUpIcon /> <span style={{position: 'relative', top: '2px'}}>{likes}</span>
              </span>
              <span className="text-black-50 pb-2 pl-2" style={{position: 'relative', top: '2px'}}>
                <CommentIcon /> 0
              </span>
              <span className="text-black-50 pb-2 pl-2">
                <VisibilityIcon /> <span style={{position: 'relative', top: '2px'}}>{views}</span>
              </span>
              </Grid>
              <Grid className="mt-1">
                {desc}
              </Grid>
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  )
}

