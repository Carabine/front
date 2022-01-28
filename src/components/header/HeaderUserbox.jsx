import React, { Fragment, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Avatar,
  Box,
  Badge,
  Menu,
  Button,
  List,
  ListItem,
  Divider,
  InputLabel,
  MenuItem, 
  FormControl, 
  Select,
  Grid
} from '@material-ui/core';

import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { useSnackbar } from 'notistack';

import { logout } from './../../redux/actions/auth'
import { changeLang } from './../../redux/actions/auth'

import avatar4 from '../../assets/images/avatar4.jpg';
import { usersAPI, authAPI } from './../../api/index'
import { i18n } from './../../utils/i18n'
import config from './../../config'

const StyledBadge = withStyles({
  badge: {
    backgroundColor: 'var(--success)',
    color: 'var(--success)',
    boxShadow: '0 0 0 2px #fff',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
})(Badge);
function HeaderUserbox(props) {
  const {
    lang,
    changeLang,
    isAuth
  } = props

  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    usersAPI.getProfileData()
      .then(res => {
        setProfileData(res.data)
      }) 
  }, [])
  
  const { enqueueSnackbar } = useSnackbar();

  const onChangeLang = async (e) => {
    try {
      await authAPI.changeLang(e.target.value)
      changeLang(e.target.value)
    } catch(err) {
      if(isAuth) {
        enqueueSnackbar(i18n.header.savingLangError[lang], { variant: 'error', autoHideDuration: 3000 });
      } else {
          changeLang(e.target.value)
      }
    }
  }

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  

  return (
    <Fragment>
      <Button
        color="inherit"
        onClick={handleClick}
        className="text-capitalize px-3 text-left btn-inverse d-flex align-items-center">
          { profileData && (
              <>  
              <Box>
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  variant="dot">
                  <Avatar sizes="44" alt={profileData.username} src={`${config.backendUrl + config.avatarsPath + profileData.avatar}`} />
                </StyledBadge>
              </Box>
              <div className="d-none d-xl-block pl-3">
                <div className="font-weight-bold pt-2 line-height-1">
                  {profileData.username}
                </div>
                <span className="text-white-50">{profileData.login}</span>
              </div>
              </>
          )}
        
        <span className="pl-1 pl-xl-3">
          <FontAwesomeIcon icon={['fas', 'angle-down']} className="opacity-5" />
        </span>
      </Button>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        onClose={handleClose}
        className="ml-2">
        <div className="dropdown-menu-right dropdown-menu-lg overflow-hidden p-0">
          <List className="text-left bg-transparent d-flex align-items-center flex-column pt-0">
            { profileData && (
              <>  
                <Box>
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    variant="dot">
                    <Avatar sizes="44" alt={profileData.username} src={`${config.backendUrl + config.avatarsPath + profileData.avatar}`} />
                  </StyledBadge>
                </Box>
            
                <div className="text-center">
                  <div className="font-weight-bold text-center pt-2 line-height-1">
                    { profileData.username}
                  </div>
                  <span className="text-black-50 text-center">
                    { profileData.login }
                  </span>
                </div>
                <Divider className="w-100 mt-2" />
                <ListItem button onClick={() => {setAnchorEl(null); props.history.push(`/users/${profileData.login}`)}}>{i18n.header.myAccount[lang]}</ListItem>
                <ListItem button onClick={() => {setAnchorEl(null); props.history.push('/settings')}}>{i18n.header.profileSettings[lang]}</ListItem>
                <Divider className="w-100" />
              </>
            )}
            <Grid item className="w-100 px-3 pt-1">
              <FormControl>
                  <InputLabel id="demo-simple-select-label">{i18n.sidebar.lang[lang]}</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={lang}
                      onChange={onChangeLang}
                  >
                      <MenuItem value={'en'}>English</MenuItem>
                      <MenuItem value={'ru'}>Русский</MenuItem>
                  </Select>
              </FormControl>
            </Grid>
            <ListItem button onClick={() => {props.logout(); props.history.push('/login')}}>{i18n.header.logout[lang]}</ListItem>
          </List>
        </div>
      </Menu>
    </Fragment>
  );
}

const mstp = (state) => ({
  lang: state.auth.lang,
  isAuth: state.auth.isAuth
})

export default withRouter(connect(mstp, {logout, changeLang})(HeaderUserbox))