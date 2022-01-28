import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Switch,
  Grid,
  Card,
  Divider,
  Avatar,
  CardContent,
  Container,
  CardActions
} from '@material-ui/core';
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux'


import TabPanel from './../common/TabPanel'
import { settingsAPI } from './../../api/index'
import { i18n } from './../../utils/i18n'
import config from './../../config'

const Settings = ({lang}) => {
  const [value, setValue] = useState(0);

  const [settingsData, setSettingsData] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    settingsAPI.getSettings()
      .then(res => {
        console.log(res)
        setSettingsData(res.data)
      })
  }, [])

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])

  const fileUploader = React.createRef()

  const onInputChange = async e => {
    e.stopPropagation();
    e.preventDefault();

    const formData = new FormData()
    formData.append(0, e.target.files[0])

    const res = await settingsAPI.changeAvatar(formData)
    setSettingsData({...settingsData, avatar: res.data})
  }

  
  return (
    <Container className="settings-page pb-3 pt-3">
      <Box>
        <Grid container>
          <Grid item md={6} xs={12}>
            <h5 className="display-4 mt-1 mb-2 font-weight-bold">
              {i18n.settings.settings[lang]}
            </h5>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              onChange={(e, newValue) => setValue(newValue)}>
              <Tab label={i18n.settings.general[lang]} />
              <Tab label={i18n.settings.security[lang]} />
            </Tabs>
            <Divider />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Grid container>
          <Grid item xs={12} className="mt-4">
            <TabPanel value={value} index={0}>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12} className="p-3">
                  <Card className="card-box">
                    <CardContent>
                      <div className="userbox">
                        {settingsData && (
                          <>
                            <Avatar className="avatar clickable" src={`${config.backendUrl + config.avatarsPath + settingsData.avatar}`} onClick={() => fileUploader.current.click()} />
                            <Typography variant="h3" className="mt-2 mb-1">{settingsData.username}</Typography>
                            <Typography variant="subtitle1">{i18n.settings.yourTier[lang]}: Premium</Typography>
                          </>
                        )}
                      </div>
                    </CardContent>
                    <CardActions> 
                      <Button onClick={() => fileUploader.current.click()} color="primary" variant="contained" fullWidth>{i18n.settings.changeAvatar[lang]}</Button>
                      <input onChange={onInputChange} type="file" accept='image/*' id="file" ref={fileUploader} style={{ display: "none" }} />
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item md={8} xs={12} className="p-3">
                  <Card className="card-box">
                    <CardContent>
                      <Typography variant="h5">{i18n.settings.profile[lang]}</Typography>
                    </CardContent>
                    <Divider />
                    {settingsData && (
                      <Formik
                      initialValues={{
                        username: settingsData.username,
                        login: settingsData.login,
                        email: settingsData.email,
                        about: settingsData.about ? settingsData.about : ''
                      }}
                      onSubmit={async (values, actions) => {
                        try {
                          await settingsAPI.changeGeneralSettings(values)
                          setSettingsData(values)
                          enqueueSnackbar(i18n.settings.settingsSaved[lang], { variant: 'success', autoHideDuration: 3000 });
                        } catch(err) {
                          if(err.response.data.type === 'NOT_UNIQUE_EMAIL') {
                            console.log( i18n.authPage.notUniqueEmail[lang])
                            actions.setFieldError('email', i18n.authPage.notUniqueEmail[lang])
                          } else if(err.response.data.type === 'NOT_UNIQUE_LOGIN') {
                            actions.setFieldError('login', i18n.authPage.notUniqueLogin[lang])
                          } else {
                            enqueueSnackbar(i18n.authPage.errorMessage[lang], { variant: 'error', autoHideDuration: 3000 });
                          }   
                        }

                      }}
                      validationSchema={
                        Yup.object({
                          username: Yup.string().required(i18n.settings.typeYourName[lang]),
                          login: Yup.string().matches(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))$/i, {message: i18n.settings.incorrectLogin[lang]}).required(i18n.settings.typeLogin[lang]),
                          email: Yup.string().matches(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, {message: i18n.settings.incorrectEmail[lang]}).required(i18n.settings.typeEmail[lang])
                        })
                      }
                      >
                        {(formik) => (
                          <>
                            <CardContent>
                              <Grid container spacing={4}>
                                <Grid item md={6} xs={12}>
                                  <TextField label={i18n.settings.realName[lang]} variant="outlined" color="secondary" name='username' onBlur={formik.handleBlur} 
                                  value={formik.values.username} fullWidth error={Boolean(formik.errors.username && formik.touched.username)}
                                  helperText={formik.errors.username && formik.touched.username ? formik.errors.username : ''} 
                                  onChange={(e) => formik.setFieldValue('username', e.target.value)}  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField label={i18n.settings.login[lang]} variant="outlined" color="secondary" name='login' onBlur={formik.handleBlur}
                                  value={formik.values.login} fullWidth error={Boolean(formik.errors.login && formik.touched.login)}
                                  helperText={formik.errors.login && formik.touched.login ? formik.errors.login : ''}
                                  onChange={(e) => formik.setFieldValue('login', e.target.value)}  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField label={i18n.settings.email[lang]} variant="outlined" color="secondary" name='email' onBlur={formik.handleBlur} 
                                  value={formik.values.email} fullWidth error={Boolean(formik.errors.email && formik.touched.email)}
                                  helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
                                  onChange={(e) => formik.setFieldValue('email', e.target.value)}  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField label={i18n.settings.about[lang]} variant="outlined" color="secondary" name="about" onBlur={formik.handleBlur} multiline rows={4}
                                  value={formik.values.about} fullWidth onChange={(e) => formik.setFieldValue('about', e.target.value)}  />
                                </Grid>
                              </Grid>  
                            </CardContent>
                            <Divider />
                            <Box className="p-3">
                              <Grid container justify="flex-end">
                                <Button color="primary" variant="contained" onClick={formik.handleSubmit}>{i18n.settings.saveChanges[lang]}</Button>
                              </Grid>
                            </Box>
                          </>
                      )}
                    </Formik>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Card className="card-box">
                <CardContent>
                  <Typography variant="h5">{i18n.settings.changePassword[lang]}</Typography>
                </CardContent>
                <Divider />
                  <Formik
                    initialValues={{
                      password: '',
                      passwordConfirmation: '',
                    }}
                    onSubmit={async (values, actions) => {
                      const res = await settingsAPI.changeSecuritySettings(values.password)
                      actions.resetForm({values: ''})
                      enqueueSnackbar(i18n.settings.passwordChanged[lang], { variant: 'success', autoHideDuration: 3000 });
                    }}
                    validationSchema={
                      Yup.object({
                        password: Yup.string().required(i18n.settings.typeNewPassword[lang]),
                        passwordConfirmation: Yup.string().test('passwords-match', i18n.settings.passwordsMustMatch[lang], function(value) {
                          return this.parent.password === value;
                        }),
                      })
                    }
                  >
                    {(formik) => (
                      <>
                        <CardContent>
                          <Grid container spacing={4}>
                            <Grid item md={4} xs={12}>
                              <TextField type="password" label={i18n.settings.password[lang]} variant="outlined" color="secondary" name='password' onBlur={formik.handleBlur} 
                                value={formik.values.password} fullWidth error={Boolean(formik.errors.password && formik.touched.password)}
                                helperText={formik.errors.password && formik.touched.password ? formik.errors.password : ''} 
                                onChange={(e) => formik.setFieldValue('password', e.target.value)}  />
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <TextField type="password" label={i18n.settings.passwordConfirmation[lang]} variant="outlined" color="secondary" name='passwordConfirmation' 
                                onBlur={formik.handleBlur} value={formik.values.passwordConfirmation} fullWidth
                                error={Boolean(formik.errors.passwordConfirmation && formik.touched.passwordConfirmation)}
                                helperText={formik.errors.passwordConfirmation && formik.touched.passwordConfirmation ? 
                                  formik.errors.passwordConfirmation : ''}
                                onChange={(e) => formik.setFieldValue('passwordConfirmation', e.target.value)}  />
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box className="p-3">
                          <Grid container justify="flex-end">
                            <Button color="primary" variant="contained" onClick={formik.handleSubmit}>{i18n.settings.saveChanges[lang]}</Button>
                          </Grid>
                        </Box>
                      </>
                    )}
                  </Formik>
              </Card>
            </TabPanel>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

const mstp = (state) => ({
  lang: state.auth.lang,
})

export default connect(mstp, null)(Settings);