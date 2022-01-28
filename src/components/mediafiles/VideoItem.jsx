import React from 'react'
import * as locale from 'date-fns/locale'
import { formatRelative } from 'date-fns'
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Grid,
  Fab,
  Card,
  CardContent,
} from '@material-ui/core';
import { Form, Formik, Field } from 'formik'
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from 'yup'

import config from './../../config'
import { formatBytes } from './../../utils/formatBytes'
import { i18n } from './../../utils/i18n'
import { mediafilesAPI } from './../../api/index'


export const VideoItem = (props) => {
  const {
    id,
    name,
    deleteMediafile,
    preview,
    setCurrentVideo,
    domain,
    fileName,
    size,
    created,
    lang,
    setVideoEditMode,
    changeVideoName,
    editMode,
    setIsVideoModalOpen
  } = props


  const onDelete = (e) => {
    e.stopPropagation()
    deleteMediafile(id)
  }

  return (
    <Grid item xs={10} sm={6} md={4} lg={3}>
      <Card className="card-box mb-4">
        <CardContent className="p-3">
          <div className="card-img-wrapper">
            <div className="card-badges card-badges-top" onClick={onDelete}>
              <Fab color="primary" size="small">
                <DeleteIcon />
              </Fab>
            </div>
            <div className="rounded mb-3 bg-secondary d-flex align-items-center align-content-center video-picture clickable"
              onClick={() => {setCurrentVideo({ domain, fileName, id, editMode }); setIsVideoModalOpen(true)}} style={{ backgroundImage: preview ? `url(${config.protocol}://${domain + config.previewsPath + preview})` : 'transparent' }} />

            {editMode ? (
              <Formik
                initialValues={{
                  name: name
                }}
                onSubmit={async values => {
                  console.log(values)
                  await mediafilesAPI.changeVideoName(id, values.name)
                  changeVideoName(id, values.name)
                  setVideoEditMode(id, false)
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string()
                    .required()
                })}
              >
                {(formik) => (
                  <Form>
                    <div className="video-name">
                      <Field name={'name'} placeholder={'Video name'} /> 
                      <CheckIcon className="clickable" onClick={formik.submitForm} /> 
                      <CloseIcon className="clickable" onClick={() => setVideoEditMode(id, false)} />
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
                <div className="video-name">
                  <div className="text">
                    <b>{name}</b>
                    <EditIcon className='pen-icon' fontSize='small' onClick={() => setVideoEditMode(id, true)} />
                  </div>
                </div>
              )}
            <div>
              <small className="d-block text-black-50 pb-2">
                {size ? formatBytes(size) : ''}
              </small>
              <small>
                {`${i18n.mediafilesPage.uploadOn[lang]}: `}
                <span className="text-black-50">{created ? formatRelative(new Date(Number(created)), new Date(), { locale: lang !== 'en' ? locale[lang] : '' }) : ''}</span>
              </small>
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  )
}