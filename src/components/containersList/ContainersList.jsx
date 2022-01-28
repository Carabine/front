import React, { useEffect, useState, useLayoutEffect } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useHistory } from "react-router-dom";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Form, Formik, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import { useSnackbar } from 'notistack';


import { projectsAPI } from './../../api/index'
import { i18n } from './../../utils/i18n'
import config from './../../config'
import { fetchContainers, changeRelation, changeProjectName, setProject, changeOptionName, addContainerOption } from './../../redux/actions/containersList'
import { deleteContainer } from './../../redux/actions/containersList'
import TabPanel from './../common/TabPanel'


// для ререндера при изменении размера экрана для обновления положения стрелки
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const ContainersList = (props) => {
  const {
    containers,
    lang,
    fetchContainers,
    match,
    changeRelation,
    deleteContainer,
    projectName,
    changeProjectName,
    desc,
    isPublic,
    categories,
    setProject,
    projectLang,
    changeOptionName,
    addContainerOption
  } = props

  useWindowSize();

  useEffect(() => {
    fetchContainers(match.params.projectId)
  }, [])

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])

  const [value, setValue] = useState(0);
  const [modalOptionId, setModalOptionId] = useState('')
  const [searchContainerLine, setSearchContainerLine] = useState('')
  const [editModes, setEditModes] = useState([])

  const history = useHistory()

  const { enqueueSnackbar } = useSnackbar();

  const handleSelectChange = (containerId, optionId, containerLinkId) => {
    setModalOptionId('')
    console.log(match.params.projectId, containerId, optionId, containerLinkId)
    changeRelation(match.params.projectId, containerId, optionId, containerLinkId)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const framesListRef = React.createRef()
  const containerItemRef = React.createRef()
  const arrowRightRef = React.createRef()
  const arrowLeftRef = React.createRef()

  // режим редактирования названия проекта
  const [isEditMode, setIsEditMode] = useState(false)


  if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify({}))
  }


  if (!JSON.parse(localStorage.projects)[match.params.projectId]) {
    localStorage.setItem('projects', JSON.stringify({ ...JSON.parse(localStorage.getItem('projects')), [match.params.projectId]: {} }))
    localStorage.setItem('projects', JSON.stringify({ ...JSON.parse(localStorage.getItem('projects')), [match.params.projectId]: { scrollLeft: 0, scrollTop: 0 } }))

  }

  // устанавливает положение скролла при обновлении компонента 
  useLayoutEffect(() => {
    if(value) return
    if (document.body.clientWidth > 768) {
      framesListRef.current.scrollLeft = JSON.parse(localStorage.getItem('projects'))[match.params.projectId].scrollLeft
      hideArrowIfNeed()
      arrowRightRef.current.style.left = framesListRef.current.scrollLeft + (framesListRef.current.offsetWidth / 100 * 90) + 'px'
      arrowLeftRef.current.style.left = framesListRef.current.scrollLeft + (framesListRef.current.offsetWidth / 100 * 10) + 'px'
    } else {
      console.log('get')
      console.log(JSON.parse(localStorage.getItem('projects'))[match.params.projectId])
      framesListRef.current.scrollTop = JSON.parse(localStorage.getItem('projects'))[match.params.projectId].scrollTop
      console.log(JSON.parse(localStorage.getItem('projects'))[match.params.projectId].scrollTop)
      console.log(framesListRef.current.scrollTop)
      framesListRef.current.scrollLeft = 0
    }
  })



  // записывает скролл в localStorage и меняет положение стрелки
  const onScroll = () => {
    if(value) return
    console.log("on scroll")
    console.log(framesListRef.current.scrollTop)
    if (document.body.clientWidth > 768) {
      const localStorageProjects = JSON.parse(localStorage.getItem('projects'))
      localStorageProjects[match.params.projectId].scrollLeft = framesListRef.current.scrollLeft
      localStorage.setItem('projects', JSON.stringify(localStorageProjects))
      hideArrowIfNeed()
      arrowRightRef.current.style.left = framesListRef.current.scrollLeft + (framesListRef.current.offsetWidth / 100 * 90) + 'px'
      arrowLeftRef.current.style.left = framesListRef.current.scrollLeft + (framesListRef.current.offsetWidth / 100 * 6) + 'px'
    } else {
      const localStorageProjects = JSON.parse(localStorage.getItem('projects'))
      localStorageProjects[match.params.projectId].scrollTop = framesListRef.current.scrollTop
      console.log('set')
      console.log(framesListRef.current.scrollTop)
      localStorage.setItem('projects', JSON.stringify(localStorageProjects))

      framesListRef.current.scrollLeft = 0
    }
  }

  // скрыть стрелку, если скроллить дальше некуда
  const hideArrowIfNeed = () => {
    if(value) return
    if (framesListRef.current.scrollWidth > framesListRef.current.scrollLeft + framesListRef.current.offsetWidth + 20) {
      arrowRightRef.current.style.display = 'block'
    } else {
      arrowRightRef.current.style.display = 'none'
    }

    if (framesListRef.current.scrollLeft < 20) {
      arrowLeftRef.current.style.display = 'none'
    } else {
      arrowLeftRef.current.style.display = 'block'
    }
  }

  const applyScroll = (direction) => {
    let leftScroll = 0
    if (direction === 'right') {
      leftScroll = 700
    } else {
      leftScroll = -700
    }

    document.querySelector('.frames.list').scroll({ top: 0, left: framesListRef.current.scrollLeft + leftScroll, behavior: 'smooth' })
  }

  const returnEmbedCode = (projectId) => {
    return `<div class="gilza-embed-container">
              <iframe src={${config.frontendUrl}/public/${projectId}?embed}} allow="camera; microphone; autoplay; encrypted-media;"></iframe>
            </div>
            <style>
              .gilza-embed-container {
                position: relative;
                width:100%; 
                max-width: 769px; 
                margin:50px auto; 
                border-radius:16px; 
                background:#ffffff; 
                overflow:hidden; 
                -webkit-mask-image: -webkit-radial-gradient(white, black);
              }
              .gilza-embed-container:before {
                display:block; 
                padding-bottom:89%; 
                content:"";
              }
              .gilza-embed-container iframe {
                position:absolute; 
                top:0; 
                left:0; 
                width:100%; 
                height:100%; 
                border:none;
              }
              @media all and (max-width: 800px) {
                .gilza-embed-container {
                  width:calc(100% - 32px); max-width:400px;
                }
                .gilza-embed-container:before {
                  padding-bottom:178%;
                }
              }
            </style>`
  }

  const returnWidgetCode = (projectId) => {
    return `<script>
      window.GILZA_WIDGET_CONFIG = {
          "type": "rectangle",
          "text": "${i18n.containersListPage.talkToMe[lang]}",
          "position": "right",
          "projectId": "${projectId}",
          "backendUrl": "${config.backendUrl}",
          "frontendUrl": "${config.frontendUrl}"
      }
  </script>
  <script src="${config.backendUrl}/static/files/widget.js"></script>`
  }

  const categoriesList = [{name: 'transport'}, {name: 'music'}, {name: 'animals'}, 
                          {name: 'sport'}, {name: 'travels'}, {name: 'games'},
                          {name: 'peopleAndBlogs'}, {name: 'humor'}, {name: 'entertainment'},
                          {name: 'newsAndPolitics'}, {name: 'hobbyAndStyle'}, {name: 'education'},
                          {name: 'scienceAndTechnology'}, {name: 'businessAndFinances'}]


  function diff(a1, a2, cat) {
    return a1.filter(i => {
      if(i.name == cat) return true
      return a2.map(c => c.name).indexOf(i.name) < 0
    })
    .concat(a2.filter(i => {
      if(i.name == cat) return false
      return a1.map(c => c.name).indexOf(i.name) < 0
    }
    ))
    .filter(i => Boolean(i.name))
  }

  return (
    <>
      <div className="containers-list-page app-page">
        <div className="top-bar">
          {isEditMode ? (
            <Formik
              initialValues={{
                name: projectName
              }}
              onSubmit={async values => {
                console.log(values)
                try {
                  await projectsAPI.changeProjectName(match.params.projectId, values.name)
                  setIsEditMode(false)
                  changeProjectName(values.name)
                } catch(err) {
                  enqueueSnackbar(i18n.containersListPage.savingNameError[lang], { variant: 'error', autoHideDuration: 3000 });
                }
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string()
                  .required()
              })}
            >
              {(formik) => (
                <Form>
                  <div className="hdr"><Field name={'name'} placeholder={i18n.containersListPage.projectName[lang]} /> <CheckIcon onClick={formik.submitForm} /> <CloseIcon onClick={() => setIsEditMode(false)} /></div>
                </Form>
              )}
            </Formik>
          ) : (
              <div className="hdr">{projectName} <EditIcon onClick={() => setIsEditMode(true)} /></div>
            )}

          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            onChange={handleChange}>
            <Tab label={i18n.containersListPage.constructor[lang]} />
            <Tab label={i18n.containersListPage.projectSetup[lang]} />
            <Tab label={i18n.containersListPage.integrations[lang]} />
          </Tabs>
        </div>
        <TabPanel value={value} index={0}>
          <div className="frames list" ref={framesListRef} onScroll={onScroll}>
            <div className="scroll-arrow arrow-left" ref={arrowLeftRef} onClick={() => applyScroll('left')}><ArrowForwardIosIcon /></div>
            <div className="items">
              {containers.map((c, index) => (
                <div className="item" key={c.id}>
                  <div className="picture" onClick={() => history.push(`/projects/${match.params.projectId}/edit/${c.id}`)}>
                    <div className="in" style={{ background: c.video != null ? `url(${config.protocol}://${c.video.domain + config.previewsPath + c.video.preview})` : 'white' }}>
                      <div className="number">{index + 1}</div>
                      <div className="actions">
                        <button type="button" className="btn delete" onClick={(e) => { e.stopPropagation(); deleteContainer(match.params.projectId, c.id) }} ><DeleteIcon /></button>
                      </div>
                      <div className="name">{c.name ? c.name : index + 1}</div>
                    </div>
                  </div>
                  {c.callbackType === 'options' && (
                    <div className="logic">
                      {c.options.map((opt) => (
                        <div className="control" style={{ position: 'relative' }} key={opt.id}>
                          {editModes.includes(opt.id) ? (
                            <Formik
                              initialValues={{
                                name: opt.name
                              }}
                              onSubmit={values => {
                                changeOptionName(match.params.projectId, c.id, opt.id, values.name)
                                setEditModes(editModes.filter((el) => el !== opt.id))
                              }}>
                                {(formik) => (
                                  <Form>
                                    <CheckIcon className="clickable edit-control-icon first" style={{background: '#1bc943'}} onClick={() => formik.handleSubmit()} />
                                    <CloseIcon className="clickable edit-control-icon second" onClick={() => setEditModes(editModes.filter((el) => el !== opt.id))} style={{background: '#f83245'}} />
                                    <button type="button" style={{ outline: 'none' }} className="btn toggle dropdown-btn" onClick={() => setModalOptionId(opt.id)}>
                                      <Field name='name' className="if-text" type="text" onClick={(e) => e.stopPropagation()} />
                                      <div className="dropdown-relation-select">
                                        <span className={'select-value'}>
                                          {containers.filter(obj => obj.id === opt.containerLinkId)[0].index + 1}
                                        </span>
                                        {modalOptionId === opt.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                      </div>
                                    </button>
                                  </Form>
                                  
                                )}                         
                            </Formik>
                          ) : (
                            <>
                              <EditIcon className="clickable edit-control-icon" onClick={() => setEditModes([...editModes, opt.id])} />
                              <button type="button" style={{ outline: 'none' }} className="btn toggle dropdown-btn" onClick={() => setModalOptionId(opt.id)}>
                                <div className="if-text">{opt.name}</div>
                                <div className="dropdown-relation-select">
                                  <span className={'select-value'}>
                                    {containers.filter(obj => obj.id === opt.containerLinkId)[0].index + 1}
                                  </span>
                                  {modalOptionId === opt.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </div>
                              </button>
                            </>
                          )}
                          
                          {modalOptionId === opt.id && (
                            // Если событие было вызвано кликом, тогда в e.x будет координата x (событие вызывается и submit) 
                            <ClickAwayListener onClickAway={(e) => e.x && setModalOptionId('')}>
                              <div className="popup">
                                <ul>
                                  {containers.map((selectContainer, index) => {
                                    const re = new RegExp(searchContainerLine.toLowerCase())
                                    if (!(searchContainerLine && !re.exec(containers[index].name ? containers[index].name.toLowerCase() : index + 1))) {
                                      return <li key={selectContainer.id} ><div className="btn" onClick={() => handleSelectChange(c.id, opt.id, containers[index].id)}><span className="ico">{index + 1}</span><span className="name">{containers[index].name ? containers[index].name : index + 1}</span></div></li>
                                    }
                                  })}
                                </ul>
                                <div className="url">
                                  <span className="ico"><SearchIcon /></span>
                                    <input type="text" placeholder={i18n.containersListPage.search[lang]} value={searchContainerLine} onChange={(e) => setSearchContainerLine(e.target.value)} />
                                </div>
                              </div>
                            </ClickAwayListener>
                          )
                          }
                        </div>
                      ))}
                      <div className="control" style={{ position: 'relative' }} onClick={() => addContainerOption(match.params.projectId, c.id, i18n.containersListPage.defaultOptionName[lang])}>
                        <button type="button" style={{ outline: 'none', background: '#3d4977', color: 'white' }} className="btn toggle dropdown-btn">
                          <div className="ff" style={{position: 'absolute', fontSize: '2rem', left: 0, right: 0, textAlign: 'center'}}>+</div>
                          <div className="if-text mx-auto" style={{opacity: 0}}>t</div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="add-frame" ref={containerItemRef}><a href={`/create/${match.params.projectId}`} className="btn"><AddCircleIcon className="add-frame-icon" />{i18n.containersListPage.addAnotherStep[lang]}</a></div>
            </div>
            <div className="scroll-arrow arrow-right" ref={arrowRightRef} onClick={() => applyScroll('right')}><ArrowForwardIosIcon /></div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {projectName ? (
            <div className="project-settings">
              <Formik
                initialValues={{
                  isPublic: isPublic,
                  desc: desc ? desc : '',
                  categories: categories,
                  projectLang: projectLang
                }}
                onSubmit={async (values, actions) => {
                  try {
                    await projectsAPI.editProject(match.params.projectId, values)
                    const {
                      isPublic,
                      desc,
                      categories
                    } = values
                    setProject({containers, name: projectName, isPublic, desc, categories})
                    enqueueSnackbar(i18n.containersListPage.projectSettingsSaved[lang], { variant: 'success', autoHideDuration: 3000 });
                  } catch(err) {
                    enqueueSnackbar(i18n.containersListPage.savingSettingsError[lang], { variant: 'error', autoHideDuration: 3000 });
                  }
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="project-settings-item">
                      {i18n.containersListPage.publicProject[lang]}
                      <Switch
                        checked={formik.values.isPublic}
                        onChange={(e) => formik.setFieldValue(e.target.name, e.target.checked)}
                        onBlur={formik.handleBlur}
                        name="isPublic"
                        color="primary"
                      />
                    </div>
                    
                    <div className="project-settings-item">
                      <TextField 
                        label={i18n.containersListPage.projectDesc[lang]} 
                        variant="outlined" 
                        onChange={(e) => formik.setFieldValue('desc', e.target.value)} 
                        onBlur={formik.handleBlur}
                        value={formik.values.desc}
                        multiline 
                        rows={4} 
                        error={Boolean(formik.errors.desc && formik.touched.desc)}
                        helperText={formik.errors.desc && formik.touched.desc ? formik.errors.desc : ''}
                      />
                    </div>
                    <div className="project-settings-item pt-0">
                      <FormControl style={{width: '150px', display: 'flex'}}>
                        <InputLabel>{i18n.containersListPage.language[lang]}</InputLabel>
                        <Select label="lang" name={`projectLang`} value={formik.values.projectLang} onChange={(e) => formik.setFieldValue('projectLang', e.target.value)}>
                            <MenuItem value={'ru'}>Русский</MenuItem>
                            <MenuItem value={'en'}>English</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <h4 className="mt-2">Categories</h4>
                    <div className="project-settings-item" style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                      <FieldArray key={Math.random()} name='categories' render={(fieldHelper) => (
                        <>
                          {formik.values.categories.map((category, index) => (
                            <div key={index} style={{margin: '5px 20px 5px 0'}}>
                              <FormControl style={{width: '150px', display: 'flex'}}>
                                <div className="remove-category close" onClick={() => fieldHelper.remove(index)} />
                                <InputLabel>Category</InputLabel>
                                <Select label="category" key={index} name={`categories.${index}.name`} value={category.name} onChange={(e) => fieldHelper.replace(index, {name: e.target.value})}>
                                  {diff(formik.values.categories, categoriesList, category.name).map((cat) => (
                                    <MenuItem key={cat.name} value={cat.name}>{i18n.sidebar[cat.name][lang]}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          ))}
                          {formik.values.categories.length < 5 && (
                              <>
                              <Button color="secondary" variant='contained' onClick={() => fieldHelper.push('')}>{i18n.containersListPage.assignCategory[lang]}</Button>
                              {formik.errors.formItems ? <div className='error-text'>{formik.errors.formItems}</div> : null}
                              </>
                          )}  
                        </>
                        )} >
                      </FieldArray>
                    </div>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit">
                      {i18n.containersListPage.save[lang]}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          )
            : ''}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {projectName ? <div className="integrations">
            <b className="integration-title font-size-lg">{i18n.containersListPage.publicLinkToProject[lang]}</b>
            <div className="integration-item">
              <div className="clipboard-text">{`${config.frontendUrl}/public/${match.params.projectId}`}</div>
              <CopyToClipboard text={`${config.frontendUrl}/public/${match.params.projectId}`}>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() => enqueueSnackbar(i18n.containersListPage.copied[lang], {autoHideDuration: 3000 })}>
                  {i18n.containersListPage.copyLink[lang]}
                </Button>
              </CopyToClipboard>
            </div>
            <b className="integration-title font-size-lg">{i18n.containersListPage.websiteEmbedCode[lang]}</b>
            <div className="integration-item">
              <div className="clipboard-text">{returnEmbedCode(match.params.projectId)}</div>
              <CopyToClipboard text={returnEmbedCode(match.params.projectId)}>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() => enqueueSnackbar(i18n.containersListPage.copied[lang], {autoHideDuration: 3000 })}>
                  {i18n.containersListPage.copyCode[lang]}
                </Button>
              </CopyToClipboard>
            </div>
            <b className="integration-title font-size-lg">{i18n.containersListPage.codeWebsiteWidget[lang]}</b>
            <div className="integration-item">
              <div className="clipboard-text">{returnWidgetCode(match.params.projectId)}</div>
              <CopyToClipboard text={returnWidgetCode(match.params.projectId)}>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() => enqueueSnackbar(i18n.containersListPage.copied[lang], {autoHideDuration: 3000 })}>
                  {i18n.containersListPage.copyCode[lang]}
                </Button>
              </CopyToClipboard>
            </div>
          </div> : ''}
        </TabPanel>
      </div>
    </>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang,
  containers: state.containersList.containers,
  projectName: state.containersList.projectName,
  desc: state.containersList.desc,
  isPublic: state.containersList.isPublic,
  categories: state.containersList.categories,
  projectLang: state.containersList.projectLang
})

export default withRouter(connect(mstp, { fetchContainers, changeRelation, deleteContainer, changeProjectName, setProject, changeOptionName, addContainerOption})(ContainersList))