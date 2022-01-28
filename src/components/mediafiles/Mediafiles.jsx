import React, { useEffect, useState } from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

import * as Yup from 'yup'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Grid,
  Button,
  CircularProgress,
  Box,
  Typography,
  LinearProgress
} from '@material-ui/core';

import { mediafilesAPI } from './../../api/index'
import { VideoItem } from './VideoItem'
import { Modal } from './../common/Modal'
import DragAndDrop from './../common/DragAndDrop'
import { i18n } from '../../utils/i18n'
import { uuid } from './../../utils/uuid'
import OldVideoPlayer  from './../common/OldVideoPlayer'
import {
  setIsModalOpen, uploadFiles, fetchMediafiles, deleteMediafile, addFiles, removeFile, setError, changeVideoName,
  setCurrentVideo, setVideoEditMode, setMainPercent
} from './../../redux/actions/mediafiles'
import config from './../../config'



const Mediafiles = (props) => {
  const {
    isModalOpen,
    setIsModalOpen,
    lang,
    uploadFiles,
    fetchMediafiles,
    mediafiles,
    deleteMediafile,
    addFiles,
    removeFile,
    files,
    isUploading,
    error,
    setError,
    filePercent,
    changeVideoName,
    currentVideo,
    setCurrentVideo,
    setVideoEditMode,
    setMainPercent,
    mainPercent
  } = props

  const [isPreviewSkipping, setIsPreviewSkipping] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    fetchMediafiles()
  }, [])

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])


  const fileUploader = React.createRef()

  const sendFiles = () => {
    if (files.length) {
      uploadFiles(files)
    }
  }

  const handleDrop = (acceptedFiles) => {
    const filesArr = Object.values(acceptedFiles)

    let rejected = false

    const filteredFiles = filesArr.filter(f => {
      if (f.type.split('/')[0] === 'video') {
        f.id = uuid()
        return true
      }
      return false
    })

    if (rejected) enqueueSnackbar(i18n.mediafilesPage.errors.addingFilesError[lang], { variant: 'error', autoHideDuration: 3000 });

    addFiles(filteredFiles)
  }

  const onInputChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const newFiles = e.target.files
    const newFilesArr = Object.values(newFiles)

    let rejected = false

    const filteredFiles = newFilesArr.filter(f => {
      if (f.type.split('/')[0] === 'video') {
        f.id = uuid()
        return true
      }
      rejected = true
      return false
    })

    if (rejected) enqueueSnackbar(i18n.mediafilesPage.errors.addingFilesError[lang], { variant: 'error', autoHideDuration: 3000 });

    addFiles(filteredFiles)
  }

  const CircularProgressWithLabel = (props) => {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="static" {...props} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center" className="pl-3">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }


  const filesElements = files.map((f, index) => (
    <div className='file-item' key={f.id} id={f.id}>
      {f.name}
      <div className={`close delete-video ${isUploading && 'dn'}`}
        onClick={() => removeFile(f.id)} />
      {isUploading && !index ? <div className="video-persent"><CircularProgressWithLabel style={{ width: '30px', height: '30px' }} value={filePercent ? filePercent : 0} /></div> : ''}
      {isUploading && index ? <div className="video-persent"><CircularProgressWithLabel style={{ width: '30px', height: '30px' }} value={0} /></div> : ''}

    </div>))

  const mediafileElements = mediafiles.map(m => <VideoItem key={m.id} setCurrentVideo={setCurrentVideo} fileName={m.fileName} domain={m.domain}
    preview={m.preview} id={m.id} name={m.name} deleteMediafile={deleteMediafile} size={m.size} created={m.created} lang={lang} 
    setVideoEditMode={setVideoEditMode} changeVideoName={changeVideoName} editMode={m.editMode} setIsVideoModalOpen={setIsVideoModalOpen} />)

  const modalContent = <DragAndDrop lang={lang} handleDrop={handleDrop}>
    <div className='drag-drop-content'>
      <DialogTitle id="alert-dialog-title">{i18n.mediafilesPage.uploadFiles[lang]}</DialogTitle>
      <DialogContent>
        {filesElements.length ? (
          <div className='files-container'>
            {mainPercent ? <LinearProgressWithLabel value={mainPercent} /> : ''}
            {filesElements}
            <Button onClick={() => fileUploader.current.click()} color="primary" disabled={isUploading} variant='contained'>
              {i18n.mediafilesPage.addMore[lang]}
              <input onChange={onInputChange} type="file" accept='video/*' id="file" ref={fileUploader} style={{ display: "none" }} multiple />
            </Button>
          </div>
        ) : (
            <>
              <div>{i18n.mediafilesPage.dragDropThisWindow[lang]}</div>
              <div>— {i18n.mediafilesPage.or[lang]} —</div>
              <div>
                <Button onClick={() => fileUploader.current.click()} color="primary" variant='contained'>
                  {i18n.mediafilesPage.selectFiles[lang]}
                  <input onChange={onInputChange} type="file" accept='video/*' id="file" ref={fileUploader} style={{ display: "none" }} multiple />
                </Button>
              </div>
            </>
          )}
      </DialogContent>
      <DialogActions>
        <Button color='primary' variant='contained' onClick={sendFiles} disabled={!filesElements.length || isUploading}>{i18n.mediafilesPage.upload[lang]}</Button>
      </DialogActions>
    </div>
  </DragAndDrop>


  const videoModalContent = <OldVideoPlayer videoPath={currentVideo && `${config.protocol}://${currentVideo.domain + config.videosPath + currentVideo.fileName}`} key={currentVideo && currentVideo.fileName} isPreviewSkipping={isPreviewSkipping} setIsPreviewSkipping={setIsPreviewSkipping} />
     

  return (
    <>
      <div className="mediafiles-page app-page">
        <Modal isOpen={error ? true : false} setOpen={setError} lang={lang} error={error ? i18n.mediafilesPage.errors[error][lang] : ''} />
        <Modal isOpen={isModalOpen} setOpen={setIsModalOpen} lang={lang} fullWidth={true} extraClasses={`${isUploading ? 'uploading' : ''} drag-drop-modal`} content={modalContent} />
        <Modal isOpen={isVideoModalOpen} setOpen={setIsVideoModalOpen} lang={lang} fullScreen={true} content={videoModalContent} extraClasses='video-preview-modal' />
        <div className="video-list">
          <div className="app-inner-content-layout--main bg-secondary">
            <div>
              <div className="px-4 py-4 bg-light text-center text-xl-left">
                <Grid container spacing={4}>
                  <Grid item xs={12} lg={7}>
                    <div>
                      <h5 className="display-4 mt-1 mb-2 font-weight-bold">
                        {i18n.mediafilesPage.videos[lang]}
                      </h5>
                      <p className="text-black-50 mb-0">
                        This is an example page created with this template!
                      </p>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={5}
                    className="d-flex align-items-center justify-content-start justify-content-xl-end">
                    <div className="mx-auto mx-xl-0">
                      <Button
                        color="primary"
                        variant="contained"
                        className="d-block d-sm-inline-block"
                        title="Upload"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <span className="btn-wrapper--label">{i18n.mediafilesPage.upload[lang]}</span>
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="divider bg-dark opacity-2" />
            </div>
            <PerfectScrollbar>
              <div className="px-4">
                <h5 className="font-size-sm text-uppercase text-black-50 font-weight-bold my-4">
                  {i18n.mediafilesPage.latestVideos[lang]}
                </h5>
                <Grid container spacing={4}>
                  {mediafileElements}
                </Grid>
              </div>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang,
  isModalOpen: state.mediafiles.isModalOpen,
  mediafiles: state.mediafiles.mediafiles,
  files: state.mediafiles.files,
  isUploading: state.mediafiles.isUploading,
  error: state.mediafiles.error,
  filePercent: state.mediafiles.filePercent,
  currentVideo: state.mediafiles.currentVideo,
  mainPercent: state.mediafiles.mainPercent
})

export default connect(mstp, {
  setIsModalOpen, uploadFiles, fetchMediafiles, deleteMediafile, addFiles, removeFile,
  setError, changeVideoName, setCurrentVideo, setVideoEditMode, setMainPercent
})(Mediafiles)

