import React from 'react'
import {withRouter} from 'react-router-dom'
import config from './../../config'
import { useState } from 'react'
import { useEffect } from 'react'
import { containersAPI } from './../../api/index'

const SingleVideo = ({match}) => {

    const [currentVideo, setCurrentVideo] = useState(null)

    useEffect(() => {
        containersAPI.getFirstProjectVideo(match.params.projectId)
            .then((res) => {
                setCurrentVideo(res.data)
            })
    }, [match.params.projectId])

    return (
        <video autoPlay muted preload="auto" playsInline loop className='single-video' src={currentVideo ? `${config.protocol}://${currentVideo.domain + config.videosPath + currentVideo.fileName}` : ''} />
    )
}

export const SingleVideoContainer = withRouter(SingleVideo)
