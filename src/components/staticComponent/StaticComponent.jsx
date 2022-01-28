import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

import config from './../../config'
import { i18n } from './../../utils/i18n'

const StaticComponent = (props) => {

    const [file, setFile] = useState(null)

    useEffect(() => {
        axios.get(`${config.backendUrl + config.filesPath}/${props.lang}/${props.match.params.page}.html`)
            .then(res => {
                setFile(res.data)
            })
    }, [props.lang, props.match.params.page])

    useEffect(() => {
        document.title = i18n.site.mainTitle[props.lang]
    }, [props.lang])

    return (
        <div className="post__content" dangerouslySetInnerHTML={{__html: file}}></div>
    )
}

const mstp = state => ({
    lang: state.auth.lang
})

export default withRouter(connect(mstp)(StaticComponent))
