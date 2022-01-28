import React from 'react'
import { Formik, Field, Form } from 'formik';
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom' 
import qs from 'qs'

import { i18n } from './../../utils/i18n'

const HeaderSearch = (props) => {

  const { 
    lang,
    history,
    location 
  } = props

  console.log(props)

  return (
    <Formik
      initialValues={{
        searchField: qs.parse(location.search, { ignoreQueryPrefix: true }).search
      }}
      onSubmit={async values => {
        history.push({
          search: `?search=${values.searchField}`
        })
      }}
    >
      <Form className="header-search">
        <Field name="searchField" placeholder={i18n.header.searchProjects[lang]} />
        <Button color="secondary" variant="contained" type="submit" className="search-btn">{i18n.header.search[lang]}</Button>
      </Form>
    </Formik>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang
})


export default withRouter(connect(mstp)(HeaderSearch))