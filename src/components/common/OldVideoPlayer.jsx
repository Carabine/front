import React, { useEffect, useState } from 'react'
import { Media, Player } from 'react-media-player'
import PlayCircleOutlineOutlinedIcon from '@material-ui/icons/PlayCircleOutlineOutlined';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import handleViewport from 'react-in-viewport';
import { connect } from 'react-redux'

import { strPadLeft } from './../../utils/strPadLeft'
import config from './../../config'
import {i18n} from './../../utils/i18n'


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
    setAreOptionsDisabled
  } = props


  const getTimeWithMinutes = (time) => {
    const minutes = Math.floor(time / 60);

    const seconds = time - minutes * 60;

    const hours = Math.floor(time / 3600);
    time = time - hours * 3600;

    const finalTime = strPadLeft(minutes, '0', 2) + ':' + strPadLeft(seconds, '0', 2)

    return finalTime
  }

  console.log(mediaProps.isPlaying)
  
  console.log(mediaProps)

  return (
    <>
      <Player playsInline={true} autoPlay={autoPlay} src={videoPath + "#t=0.1"} ref={forwardedRef} className="media-player" 
              //  onTimeUpdate={({currentTime, duration}) => {
              //   if(currentTime === duration) {
              //     mediaProps.pause(); setAreOptionsDisabled(false)
              //     console.log('VIDEO END')
              //   }
              //   }} 
      />
      {mediaProps.isPlaying ? (
        <div className="media-controls" onClick={() => {mediaProps.pause()}}>
          <div className="top-controls" onClick={(e) => e.stopPropagation()}>
            <div className="control-item">
              {`${getTimeWithMinutes(Math.floor(mediaProps.currentTime))} / ${getTimeWithMinutes(Math.floor(mediaProps.duration))}`}
            </div>
            <div className="control-item clickable">
              <ReplayOutlinedIcon onClick={() => mediaProps.seekTo(0)} />
            </div>
          </div>
          {madeWith ? <a className="made-with" href={config.frontendUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation() }}>{i18n.site.createdOnGilza[lang]}</a> : ''}
        </div>
      ) : (
            <div className="fade-overlay" onClick={() => {mediaProps.play()}}>
              <div className="play-btn">
                <PlayCircleOutlineOutlinedIcon />
              </div>
              {videoInsc ? <div className={'video-insc'} onClick={(e) => e.stopPropagation()}>{videoInsc}</div> : ''}
              {madeWith ? <a className="made-with" href={config.frontendUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation() }}>{i18n.site.createdOnGilza[lang]}</a> : ''}
            </div>
      )}
    </>
  )
}

const ViewportedVideo = handleViewport(Video)

const VideoPlayer = ({ videoPath, videoInsc, madeWith, stopOutOfViewport, loop, onVideoPlay, lang, setAreOptionsDisabled, autoPlay }) => {

  return (
    <Media>
      {mediaProps => (
        <div className="media">
          <ViewportedVideo mediaProps={mediaProps}
            videoInsc={videoInsc} videoPath={videoPath} madeWith={madeWith} stopOutOfViewport={stopOutOfViewport} loop={loop} onVideoPlay={onVideoPlay}
            lang={lang} setAreOptionsDisabled={setAreOptionsDisabled} autoPlay={autoPlay} />
        </div>
      )}
    </Media>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang
})

export default connect(mstp)(VideoPlayer)
