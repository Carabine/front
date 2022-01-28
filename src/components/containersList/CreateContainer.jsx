import React, { useState, useEffect } from 'react'
import { Form, Formik, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { useHistory } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { connect } from 'react-redux'

import { i18n } from './../../utils/i18n'
import { mediafilesAPI, containersAPI } from './../../api/index'
import config from './../../config'
import OldVideoPlayer  from './../common/OldVideoPlayer'


const CreateContainer = ({match, lang}) => {
  const history = useHistory()

  const [mediafiles, setMediafiles] = useState([])
  const [previewMode, setPreviewMode] = useState(document.body.clientWidth > 768 ? 'pc' : 'mobile')
  const [isPreviewSkipping, setIsPreviewSkipping] = useState(false)

  useEffect(() => {
    mediafilesAPI.fetchMediafiles()
      .then(res => {
        console.log(res.data)
        setMediafiles(res.data)
      })
  }, [])

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])

  const totalSteps = 2

  const [stepNumber, setStepNumber] = useState(0);

  const isLastStep = stepNumber === totalSteps - 1;

  const next = () => {
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = () => {
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const validations = [
      Yup.object({
        videoId: Yup.string().matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i).required("Выберите видео")
      }),
      Yup.object({
      callbackType: Yup.string().required(i18n.createContainerPage.chooseCallback[lang])
    })
  ]


  return (
      <>
      <div className="create-container-page app-page">
          <Formik
            initialValues={{
                videoId: '',
                options: [i18n.createContainerPage.first[lang], i18n.createContainerPage.second[lang], ''],
                formItems: [i18n.createContainerPage.name[lang], ''],
                videoInsc: '',
                name: '',
                callbackType: 'options'
            }}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, actions) => {
                if(isLastStep) {
                  console.log(values, match.params.projectId)
                  if(values.callbackType === 'options') {
                    values.options = values.options.filter((el) => Boolean(el) != Boolean(null))
                    if(!values.options.length) {
                      return actions.setFieldError('options', i18n.createContainerPage.fillOneField[lang])
                    }
                    await containersAPI.createContainer(values, match.params.projectId)
                  }
                  if(values.callbackType === 'formItems') {
                    values.formItems = values.formItems.filter((el) => Boolean(el) != Boolean(null))
                    if(!values.formItems.length) {
                      return actions.setFieldError('formItems', i18n.createContainerPage.fillOneField[lang])
                    }
                    await containersAPI.createContainer(values, match.params.projectId)
                  }
                  if(values.callbackType === 'empty') {
                    await containersAPI.createContainer(values, match.params.projectId)
                  }
                  return history.push(`/projects/${match.params.projectId}`)
                } else {
                  next(values)
                  actions.setSubmitting(false)
                }
            }}
            validationSchema={validations[stepNumber]}
          > 
            {(formik) => ( 
              <Form>  
                <div className="column-with-settings">
                  <div className={`settings-content ${stepNumber === 1 ? 'second-step' : 'first-step'}`}>
                    {stepNumber === 0 ? (
                      <>  
                      {i18n.createContainerPage.letsStarted[lang]}
                      <span>{i18n.createContainerPage.startByAdding[lang]}</span>   
                      <div className="videos-choise">
                          {mediafiles.map(m => (
                              <div key={m.id} className='video-wrapper'>
                                <Field id={m.id} type='radio' name="videoId" value={m.id} className="dn" />
                                <Tooltip title={m.name}>
                                  <label htmlFor={m.id} className="video-item" style={{backgroundImage: `url(${config.protocol}://${m.domain + config.previewsPath + m.preview})`}} />
                                </Tooltip>
                              </div>
                          ))} 
                          <div className='video-wrapper'>
                            <label className="video-item add-video" onClick={() => history.push("/mediafiles")}> 
                              <div className="plus radius"></div>
                            </label>
                          </div>                         
                      </div>
                      {formik.errors.videoId ? <div className='error-text'>{formik.errors.videoId}</div> : null}
                      </>
                    ) : stepNumber === 1 && (
                      <>
                        <span>{i18n.createContainerPage.howYouGetCallback[lang]}</span>
                        
                        <div className="callback-choise">
                            <Field id="options" type='radio' name="callbackType" value='options' className="dn" />
                            <label htmlFor="options">{i18n.createContainerPage.options[lang]}</label>
                            <Field id='formItems' type='radio' name="callbackType" value="formItems" className="dn" />
                            <label htmlFor="formItems">{i18n.createContainerPage.form[lang]}</label>
                            <Field id='empty' type='radio' name="callbackType" value="empty" className={'dn'} />
                            <label htmlFor="empty">{i18n.createContainerPage.notNeed[lang]}</label>                           
                        </div>

                        { formik.values.callbackType === 'options' ?
                          <div className="midcell choices">
                            <div className="items custom-form">
                              <FieldArray name='options' render={(fieldHelper) => (
                                <>
                                  {formik.values.options.map((option, index) => (
                                    <div key={index} className="field-container">
                                      <div className="remove-field close" onClick={() => fieldHelper.remove(index)} />
                                      <Field name={`options.${index}`} placeholder={`${i18n.createContainerPage.option[lang]} ${index + 1}`} />
                                    </div>
                                  ))}
                                  <div className="btn add" onClick={() => fieldHelper.push('')}>{i18n.createContainerPage.addAnotherOption[lang]}</div>
                                  {formik.errors.options ? <div className='error-text'>{formik.errors.options}</div> : null}
                                </>
                              )} >
                              </FieldArray>
                            </div>
                          </div>

                        : formik.values.callbackType === 'formItems' ?
                          <div className="midcell choices">
                            <div className="items custom-form">
                              <FieldArray name='formItems' render={(fieldHelper) => (
                                <>
                                  {formik.values.formItems.map((formItem, index) => (
                                    <div key={index} className="field-container">
                                      <div className="remove-field close" onClick={() => fieldHelper.remove(index)} />
                                      <Field key={index} name={`formItems.${index}`} placeholder={`${i18n.createContainerPage.field[lang]} ${index + 1}`} />
                                    </div>
                                  ))}
                                  <div className="btn add" onClick={() => fieldHelper.push('')}>{i18n.createContainerPage.addAnotherField[lang]}</div>
                                  {formik.errors.formItems ? <div className='error-text'>{formik.errors.formItems}</div> : null}
                                </>
                                )} >
                              </FieldArray>
                            </div>
                          </div>
                        : <div className="empty"></div>
                        } 

                        <div className="video-name">
                            <span>{i18n.createContainerPage.typeStepName[lang]}</span>
                            <div className="items custom-form">
                                <div className="field-container">
                                  <Field name={'name'} placeholder={i18n.createContainerPage.stepName[lang]} />
                                  {formik.errors.name ? <div className='input-error'>{formik.errors.name}</div> : null}
                                  </div>
                            </div>
                        </div>

                        <div className="video-insc">
                            <span>{i18n.createContainerPage.wouldLikeOverwriteVideo[lang]}</span>
                            <div className="items custom-form">
                                <div className="field-container">
                                  <Field name='videoInsc' component="textarea" placeholder={i18n.createContainerPage.overwriteText[lang]} />
                                </div>
                            </div>
                        </div>
                      </>
                      )}

                      <div className="buttons">
                          {stepNumber > 0 && (
                              <button onClick={() => previous()} type="button" className="btn back clickable"><ArrowBackIcon /></button>
                          )}
                          {!formik.isSubmitting && (
                            <button type="submit" className="btn next">{isLastStep ? i18n.createContainerPage.createContainer[lang] : i18n.createContainerPage.next[lang]}</button>
                          )
                          }
                      </div>
                  </div>
                </div>
                <div className={`preview-column mode-${previewMode}`}>
                  <div className="preview-container">
                    <div className="border-container">
                      <div className="site">
                        <div className="frames">
                          <div className="video-wrapper">
                            <OldVideoPlayer videoPath={mediafiles.length && formik.values.videoId ? `${config.protocol}://${mediafiles.filter(obj => obj.id === formik.values.videoId)[0].domain + config.videosPath + mediafiles.filter(obj => obj.id === formik.values.videoId)[0].fileName}`  : ''} videoInsc={formik.values.videoInsc} key={formik.values.videoId} isPreviewSkipping={isPreviewSkipping} setIsPreviewSkipping={setIsPreviewSkipping} />
                          </div>
                          <div className="callback">
                            <div className="callback-content">

                              {formik.values.callbackType === 'options' && 
                                <div className="options-wrapper">
                                  {formik.values.options.filter(opt => Boolean(opt) != Boolean(null)).map((opt, index) => <div key={index} className="item">{opt}</div>)}                              
                                </div>
                              }

                              {formik.values.callbackType === 'formItems' && 
                                <div className="form-wrapper">
                                  <div className="custom-form">
                                    {formik.values.formItems.filter(formItem => Boolean(formItem) != Boolean(null)).map((formItem, index) => (
                                      <div key={index} className="field-container">
                                        <input placeholder={formItem} />
                                      </div>
                                    ) 
                                    )}
                                    <input type="submit" onClick={(e) => e.preventDefault()} className="btn btn-default" value={i18n.createContainerPage.send[lang]} />
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="switch-mode">
                      <div className={`btn ${previewMode === 'pc' && 'active'}`} onClick={() => setPreviewMode('pc')}>
                        <DesktopWindowsIcon />
                      </div>
                      <div className={`btn ${previewMode === 'mobile' && 'active'}`} onClick={() => setPreviewMode('mobile')}>
                        <PhoneAndroidIcon />
                      </div>
                    </div>
                  </div>      
                </div>
              </Form>
            )}
                
          </Formik>
      </div>
      </>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang
}) 

export default withRouter(connect(mstp, null)(CreateContainer))