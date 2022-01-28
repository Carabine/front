import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Grid,
  Container,
  Input,
  InputLabel,
  InputAdornment,
  FormControlLabel,
  IconButton,
  Box,
  Typography,
  Checkbox,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Tooltip,
  TextField,
  FormControl
} from '@material-ui/core';

import MailOutlineTwoToneIcon from '@material-ui/icons/MailOutlineTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';

import { NavLink as RouterLink, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';


import { authAPI } from './../../api'
import { i18n } from '../../utils/i18n'
import { successAuth, changeLang } from "../../redux/actions/auth"



const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '6px',
    '& > div': {
      maxWidth: 40,
      height: '4px',
      borderRadius: '25px',
      width: '100%',
      backgroundColor: '#000'
    }
  }
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: theme.palette.primary[900],
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1
    }
  }
}))(props => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}>
      {value === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const Login = props => {
  const { 
    successAuth, 
    lang, 
    history, 
    changeLang 
  } = props

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [checked1, setChecked1] = React.useState(true);

  const handleChange1 = event => {
    setChecked1(event.target.checked);
  };

  useEffect(() => {
    document.title = i18n.site.mainTitle[lang]
  }, [lang])

  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    login: Yup.string()
      .matches(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})|^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))$/i, { message: i18n.authPage.incorrectEmailOrLogin[lang] })
      .required(i18n.authPage.typeEmailOrLogin[lang]),
    password: Yup.string()
      .required(i18n.authPage.typePassword[lang])
  })

  const SignupSchema = Yup.object().shape({
    email: Yup.string()
    .matches(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, {message: i18n.authPage.incorrectEmail[lang]})
    .required(i18n.authPage.enterYourEmail[lang]),
  })

  return (
    <Fragment>
      <div className="app-wrapper min-vh-100 bg-white">
        <div className="app-main min-vh-100">
          <div className="app-content p-0">
            <div className="app-inner-content-layout--main">
              <div className="flex-grow-1 w-100 d-flex align-items-center">
                <div className="bg-composed-wrapper--content">
                  <Grid container spacing={0} className="min-vh-100">
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      className="d-flex align-items-center">
                      <Container maxWidth="sm">
                        <div className="pt-5 pb-4">
                          <StyledTabs
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}>
                            <StyledTab label={i18n.authPage.createAccount[lang]} />
                            <StyledTab label={i18n.authPage.signIn[lang]} />
                            <StyledTab label={i18n.authPage.recoverPassword[lang]} />
                          </StyledTabs>
                        </div>
                        <TabPanel value={value} index={0}>
                          <Formik
                            initialValues={{ email: '' }}
                            validationSchema={SignupSchema}
                            onSubmit={async (values, actions) => {
                                try {
                                    await authAPI.signup({...values, lang})
                                    successAuth()
                                    history.push('/main')
                                } catch(err) {
                                    if(err.response.data.type === 'NOT_UNIQUE_EMAIL') {
                                      actions.setFieldError('email', i18n.authPage.notUniqueEmail[lang])
                                    } else {
                                        enqueueSnackbar(i18n.authPage.errorMessage[lang], { variant: 'error', autoHideDuration: 3000 });
                                    }        
                                }
                            }}
                            >
                            {(formik) => (
                              <Form>
                                <h3 className="display-4 mb-2 font-weight-bold">
                                  {i18n.authPage.createAccount[lang]}
                                </h3>
                                <p className="font-size-lg mb-5 text-black-50">
                                  {i18n.authPage.typeEmailWillGood[lang]}
                                </p>
                                <div className="mb-3">
                                  <TextField
                                    variant="outlined"
                                    label={i18n.authPage.email[lang]}
                                    fullWidth
                                    placeholder={i18n.authPage.enterYourEmail[lang]}
                                    type="email"
                                    name="email"
                                    onChange={(e) => formik.setFieldValue('email', e.target.value)}
                                    value={formik.values.email}
                                    error={Boolean(formik.errors.email && formik.touched.email)}
                                    helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
                                    onBlur={formik.handleBlur}
                                  />
                                </div>
                                <div className="form-group pt-2 mb-4">
                                  {i18n.authPage.byClikingCreateAccount[lang]}
                                </div>

                                <Button
                                  color="primary"
                                  size="large"
                                  variant="contained"
                                  type="submit"
                                  className="mb-5">
                                  {i18n.authPage.createAccount[lang]}
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                          <h3 className="display-4 mb-2 font-weight-bold">
                          {i18n.authPage.existingAccount[lang]}
                          </h3>
                          <p className="font-size-lg mb-5 text-black-50">
                            {i18n.authPage.alreadyHaveAccount[lang]}
                          </p>
                          <Card className="mx-0 bg-secondary mt-0 w-100 p-0 mb-4 border-0">
                            {/* <div className="card-header d-block p-3 mx-2 mb-0 mt-2 rounded border-0">
                              <div className="text-muted text-center mb-3">
                                <span>Sign in with</span>
                              </div>
                              <div className="text-center">
                                <Button
                                  variant="outlined"
                                  className="mr-2 text-facebook">
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={['fab', 'facebook']}
                                    />
                                  </span>
                                  <span className="btn-wrapper--label">
                                    Facebook
                                  </span>
                                </Button>
                                <Button
                                  variant="outlined"
                                  className="ml-2 text-twitter">
                                  <span className="btn-wrapper--icon">
                                    <FontAwesomeIcon
                                      icon={['fab', 'twitter']}
                                    />
                                  </span>
                                  <span className="btn-wrapper--label">
                                    Twitter
                                  </span>
                                </Button>
                              </div>
                            </div> */}
                            <CardContent className="p-3">
                              {/* <div className="text-center text-black-50 mb-3">
                                <span>Or sign in with credentials</span>
                              </div> */}
                              <Formik
                                initialValues={{ login: '', password: '' }}
                                validationSchema={LoginSchema}
                                onSubmit={async (values, actions) => {
                                  try {
                                    const res = await authAPI.login(values)
                                    if(res.data.lang) {
                                      changeLang(res.data.lang)
                                    }
                                    successAuth()
                                    history.push('/main')
                                  } catch (err) {
                                    console.log(err.response.data)
                                    if (err.response.status === 401) {
                                      actions.setFieldError('password', i18n.authPage.wrongFormData[lang])
                                    } else if (err.response.status === 500) {
                                      enqueueSnackbar(i18n.authPage.errorMessage[lang], { variant: 'error', autoHideDuration: 3000 });
                                    }
                                  }

                                }}
                              >
                                {(formik) => (
                                  <Form className="px-5">
                                    <div className="mb-3">
                                      {console.log(formik)}
                                      <FormControl className="w-100">
                                        <InputLabel htmlFor="input-with-icon-adornment">
                                          {i18n.authPage.emailOrLogin[lang]}
                                        </InputLabel>
                                        <Input
                                          fullWidth
                                          name="login"
                                          onChange={(e) => formik.setFieldValue('login', e.target.value)}
                                          value={formik.values.login}
                                          error={Boolean(formik.errors.login && formik.touched.login)}
                                          onBlur={formik.handleBlur}
                                          startAdornment={
                                            <InputAdornment position="start">
                                              <MailOutlineTwoToneIcon />
                                            </InputAdornment>
                                          }
                                        />
                                      </FormControl>
                                      <div style={{color: 'red'}}>
                                        {formik.errors.login && formik.touched.login ? formik.errors.login : ''}
                                      </div>
                                    </div>
                                    <div className="mb-3">
                                      <FormControl className="w-100">
                                        <InputLabel htmlFor="standard-adornment-password">
                                          {i18n.authPage.password[lang]}
                                        </InputLabel>
                                        <Input
                                          name="password"
                                          fullWidth
                                          type="password"
                                          onChange={(e) => formik.setFieldValue('password', e.target.value)}
                                          value={formik.values.password}
                                          error={Boolean(formik.errors.password && formik.touched.password)}
                                          onBlur={formik.handleBlur}
                                          startAdornment={
                                            <InputAdornment position="start">
                                              <LockTwoToneIcon />
                                            </InputAdornment>
                                          }
                                        />
                                      </FormControl>
                                      <div style={{color: 'red'}}>
                                        {formik.errors.password && formik.touched.password ? formik.errors.password : ''}
                                      </div>
                                    </div>
                                    {/* <div className="w-100">
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={checked1}
                                            onChange={handleChange1}
                                            value="checked1"
                                            color="primary"
                                          />
                                        }
                                        label="Remember me"
                                      />
                                    </div> */}
                                    <div className="text-center">
                                      <Button
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                        type="submit"
                                        className="my-2">
                                        {i18n.authPage.signIn[lang]}
                                      </Button>
                                    </div>
                                  </Form>
                                )}
                              </Formik>
                              
                            </CardContent>
                          </Card>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                          <Formik
                            initialValues={{ email: '' }}
                            validationSchema={SignupSchema}
                            onSubmit={async (values, actions) => {
                                try {
                                    await authAPI.recoverPassword(values)
                                    enqueueSnackbar(i18n.authPage.sentSuccesfuly[lang], { variant: 'success', autoHideDuration: 3000 });
                                } catch(err) {
                                    if (err.response.status === 500) {
                                      return actions.setFieldError('email', i18n.authPage.incorrectEmail[lang])
                                    }
                                    enqueueSnackbar(i18n.authPage.errorMessage[lang], { variant: 'error', autoHideDuration: 3000 });
                                }
                            }}
                            >
                            {(formik) => (
                              <Form>
                                <h3 className="display-4 mb-2 font-weight-bold">
                                  {i18n.authPage.recoverPassword[lang]}
                                </h3>
                                <p className="font-size-lg mb-5 text-black-50">
                                  {i18n.authPage.typeEmailAndGetPassword[lang]}
                                </p>
                                <div className="mb-3">
                                  <TextField
                                    variant="outlined"
                                    label={i18n.authPage.email[lang]}
                                    fullWidth
                                    placeholder={i18n.authPage.enterYourEmail[lang]}
                                    type="email"
                                    name="email"
                                    onChange={(e) => formik.setFieldValue('email', e.target.value)}
                                    value={formik.values.email}
                                    error={Boolean(formik.errors.email && formik.touched.email)}
                                    helperText={formik.errors.email && formik.touched.email ? formik.errors.email : ''}
                                    onBlur={formik.handleBlur}
                                  />
                                </div>
                               
                                <Button
                                  color="primary"
                                  size="large"
                                  variant="contained"
                                  type="submit"
                                  className="mb-5">
                                  {i18n.authPage.recover[lang]}
                                </Button>
                              </Form>
                            )}
                          </Formik>
                        </TabPanel>
                      </Container>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mstp = ({auth: {lang}}) => ({ lang })

export default withRouter(connect(mstp, { successAuth, changeLang })(Login));
