import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useState } from 'react'
import { connect } from 'react-redux'
import {
  InputAdornment,
  Button,
  TextField,
  DialogTitle,
  DialogContent,
  Card,
  Grid
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom'
import { useSnackbar } from 'notistack';

import { Project } from './Project'
import { Modal } from './../common/Modal'
import { Preloader } from './../common/Preloader'
import { projectsAPI } from './../../api'
import { i18n } from './../../utils/i18n'
import { fetchProjectsList, addProjectAC, deleteProject, toggleIsError } from './../../redux/actions/projectsList'


const ProjectsList = (props) => {
  const {
    lang,
    projects,
    isFetching,
    isError,
    fetchProjectsList,
    addProjectAC,
    deleteProject,
    toggleIsError,
    history
  } = props

  useEffect(() => {
    fetchProjectsList()
  }, [])

  const [isModalOpen, setModalOpen] = useState(false)

  const [searchField, setSearchField] = useState('')

  const [filteredProjects, setFilteredProjects] = useState([])

  useEffect(() => {
    if(projects) {
      const re = new RegExp(searchField.toLowerCase())
      setFilteredProjects(projects.filter(p => !(searchField && !re.exec(p.name.toLowerCase()))))
    }
  }, [projects, searchField])

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])

  const { enqueueSnackbar } = useSnackbar()

 
  if (isFetching) return <Preloader />

  const modalContent = <>
    <DialogTitle id="alert-dialog-title">{i18n.projectsPage.createProject[lang]}</DialogTitle>
    <DialogContent>
      <Formik initialValues={{ name: '' }}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required(i18n.projectsPage.typeProjectName[lang])
          })
        }
        onSubmit={async (values, actions) => {
          try {
            const res = await projectsAPI.create(values)
            addProjectAC(res.data)
          } catch (err) {
            enqueueSnackbar(i18n.authPage.errorMessage[lang], { variant: 'error', autoHideDuration: 3000 });
          }
          setModalOpen(false)
        }}
      >
        {({ errors, touched }) => (
          <Form className="custom-form">
            <div className="field-container">
              <Field name="name" placeholder={i18n.projectsPage.projectName[lang]} />
              {errors.name && touched.name ? <div className='input-error'>{errors.name}</div> : null}
            </div>
            <input type="submit" className="btn btn-default" value={i18n.projectsPage.createProject[lang]} />
          </Form>
        )}
      </Formik>
    </DialogContent>
  </>

  return (
    <>
      <div className="projects-page app-page">
      <div className="app-inner-content-layout--main bg-secondary">
        <Card className="card-box mb-4" style={{overflow: 'visible'}}>
            <div className="d-block p-3 d-md-flex justify-content-between align-items-center text-center text-md-left">
              <div className="d-flex flex-md-row flex-column align-items-center">
                <div className="d-flex flex-row align-items-center">
                  <div className="font-size-lg font-weight-bold pr-md-0 pr-2">{i18n.projectsPage.projects[lang]}</div>
                  <div className="mx-3 d-none d-md-block">
                    <div className="divider-v position-relative" />
                    <div className="divider-v position-relative" />
                  </div>
                  <span className="text-black-50 font-size-md pl-md-0 pr-md-3 pl-2">
                    {filteredProjects.length} {i18n.projectsPage.inTotal[lang]}
                  </span>
                </div>
                <div>
                  <TextField
                    margin="dense"
                    variant="outlined"
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="d-block d-md-flex align-items-center">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  className="font-weight-bold px-3"
                  onClick={() => setModalOpen(true)}>
                  {i18n.projectsPage.addProject[lang]}
                </Button>
              </div>
            </div>
        </Card>
        <PerfectScrollbar>
          <div className="projects-list-container">
              <div className="px-4">
                <Grid container spacing={4}> 
                  {
                    filteredProjects.map(p => (
                      <Project path={p.path} key={p.id} id={p.id} name={p.name} fileName={p.video ? p.video.fileName : ''} 
                               domain={p.video ? p.video.domain : ''} desc={p.desc} deleteProject={deleteProject} created={p.created} 
                               lang={lang} history={history} estimates={p.estimates} views={p.views} />
                    ))
                  }
                </Grid>
              </div>
          </div>
        </PerfectScrollbar>
        <Modal isOpen={isModalOpen} setOpen={setModalOpen} lang={lang} fullWidth={true} extraClasses={'create-project-modal'} content={modalContent} title={i18n.projectsPage.createProject[lang]} />
      </div>
      </div>
    </>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang,
  projects: state.projectsList.projects,
  isFetching: state.projectsList.isFetching,
  isError: state.projectsList.isError
})

export default withRouter(connect(mstp, { fetchProjectsList, addProjectAC, deleteProject, toggleIsError })(ProjectsList))