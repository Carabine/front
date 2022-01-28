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



const EditContainer = ({match, lang}) => {
  const history = useHistory()

  const [mediafiles, setMediafiles] = useState([])
  const [previewMode, setPreviewMode] = useState(document.body.clientWidth > 500 ? 'pc' : 'mobile')
  const [containerData, setContainerData] = useState(false)
  const [isPreviewSkipping, setIsPreviewSkipping] = useState(false)

  useEffect(() => {
    mediafilesAPI.fetchMediafiles()
      .then(res => {
        console.log(res)
        setMediafiles(res.data)
        containersAPI.getContainerData(match.params.projectId, match.params.containerId)
            .then(res => {
                console.log(res)
                setContainerData(res.data)
            })
      })
  }, [])

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])

  const totalSteps = 2

  const [stepNumber, setStepNumber] = useState(1);

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
      callbackType: Yup.string().required()
    })
  ]


  return (
      <>
      <div className="create-container-page app-page">
          {containerData && (
          <Formik
            initialValues={{
                videoId: containerData.video ? containerData.video.id : null,
                options: containerData.options,
                formItems: containerData.form ? containerData.form.formItems : null,
                videoInsc: containerData.videoInsc,
                name: containerData.name,
                callbackType: containerData.callbackType
            }}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={async (values, actions) => {
                if (isLastStep) {
                  console.log(values, match.params.projectId)
                  if(values.callbackType === 'options') {
                    values.options = values.options.filter((el) => Boolean(el.name) != Boolean(null))
                    if(!values.options.length) {
                      return actions.setFieldError('options', i18n.editContainerPage.fillOneField[lang])
                    }
                    await containersAPI.editContainer(values, match.params.projectId, match.params.containerId)
                  }
                  if(values.callbackType === 'formItems') {
                    values.formItems = values.formItems.filter((el) => Boolean(el) != Boolean(null))
                    if(!values.formItems.length) {
                      return actions.setFieldError('options', i18n.editContainerPage.fillOneField[lang])
                    }
                    await containersAPI.editContainer(values, match.params.projectId, match.params.containerId)
                  }
                  if(values.callbackType === 'empty') {
                    await containersAPI.editContainer(values, match.params.projectId, match.params.containerId)
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
                      {i18n.editContainerPage.letsStarted[lang]}
                      <span>{i18n.editContainerPage.startByAdding[lang]}</span>    
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
                        <span>{i18n.editContainerPage.howYouGetCallback[lang]}</span>

                        { formik.values.callbackType === 'options' ?
                          <div className="midcell choices">
                            <div className="items custom-form">
                              <FieldArray name='options' render={(fieldHelper) => (
                                <>
                                  {formik.values.options.map((option, index) => (
                                    <div key={index} className="field-container">
                                      <div className="remove-field close" onClick={() => fieldHelper.remove(index)} />
                                      <Field name={`options.${index}.name`} placeholder={`${i18n.editContainerPage.option[lang]} ${index + 1}`} />
                                    </div>
                                  ))}
                                  <div className="btn add" onClick={() => fieldHelper.push('')}>{i18n.editContainerPage.addAnotherOption[lang]}</div>
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
                                      <Field key={index} name={`formItems.${index}.name`} placeholder={`${i18n.editContainerPage.field[lang]} ${index + 1}`} />
                                    </div>
                                  ))}
                                  <div className="btn add" onClick={() => fieldHelper.push('')}>{i18n.editContainerPage.addAnotherField[lang]}</div>
                                  {formik.errors.formItems ? <div className='error-text'>{formik.errors.formItems}</div> : null}
                                </>
                                )} >
                              </FieldArray>
                            </div>
                          </div>
                        : <div className="empty"></div>
                        } 

                        <div className="video-name">
                        <span>{i18n.editContainerPage.typeStepName[lang]}</span>
                            <div className="items custom-form">
                                <div className="field-container">
                                  <Field name={'name'} placeholder={i18n.editContainerPage.stepName[lang]} />
                                  {formik.errors.name ? <div className='input-error'>{formik.errors.name}</div> : null}
                                  </div>
                            </div>
                        </div>

                        <div className="video-insc">
                          <span>{i18n.editContainerPage.wouldLikeOverwriteVideo[lang]}</span>
                            <div className="items custom-form">
                                <div className="field-container">
                                <Field name='videoInsc' component="textarea" placeholder={i18n.editContainerPage.overwriteText[lang]} />
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
                            <button type="submit" className="btn next">{isLastStep ? i18n.editContainerPage.update[lang] : i18n.editContainerPage.next[lang]}</button>
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
                                  {formik.values.options.filter(opt => Boolean(opt) != Boolean(null)).map(opt => opt.name ? <div key={opt.id} className="item">{opt.name}</div> : null)}                              
                                </div>
                              }

                              {formik.values.callbackType === 'formItems' && 
                                <div className="form-wrapper">
                                  <div className="custom-form">
                                    {formik.values.formItems.filter(formItem => Boolean(formItem) != Boolean(null)).map((formItem, index) => (
                                      <div key={index} className="field-container">
                                        <input placeholder={formItem.name} />
                                      </div>
                                    ) 
                                    )}
                                    <input type="submit" onClick={(e) => e.preventDefault()} className="btn btn-default" value={i18n.editContainerPage.send[lang]} />
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
          )}
      </div>
      </>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang
}) 

export default withRouter(connect(mstp, null)(EditContainer))