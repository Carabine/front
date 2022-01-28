import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Hidden, IconButton, AppBar, Box, Tooltip, Button } from '@material-ui/core';
import { connect } from 'react-redux';

import {
  setSidebarToggle,
  setSidebarToggleMobile
} from '../../redux/actions/themeOptions'
import projectLogo from './../../logo.svg'

import HeaderLogo from './HeaderLogo';
import HeaderUserbox from './HeaderUserbox';
import HeaderSearch from './HeaderSearch'
import HeaderDots from './HeaderDots'

import MenuOpenRoundedIcon from '@material-ui/icons/MenuOpenRounded';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';

import { i18n } from './../../utils/i18n'

const Header = props => {
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const {
    headerShadow,
    headerFixed,
    sidebarToggleMobile,
    setSidebarToggleMobile,
    setSidebarToggle,
    sidebarToggle,
    isAuth,
    lang
  } = props;

  return (
    <Fragment>
      <AppBar
        color="secondary"
        className={clsx('app-header', {
          'app-header-collapsed-sidebar': props.isCollapsedLayout
        })}
        position={headerFixed ? 'fixed' : 'absolute'}
        elevation={headerShadow ? 11 : 3}>
        {!props.isCollapsedLayout && <HeaderLogo />}
        <Box className="app-header-toolbar">
          <Hidden lgUp>
            <Box
              className="app-logo-wrapper"
              title="Gilza">
              <Link to="/" className="app-logo-link">
                <IconButton
                  color="primary"
                  size="medium"
                  className="app-logo-btn">
                  <img
                    className="app-logo-img"
                    alt="Gilza"
                    src={projectLogo}
                  />
                </IconButton>
              </Link>
              <Hidden smDown>
                <Box className="app-logo-text">Gilza</Box>
              </Hidden>
            </Box>
          </Hidden>
          <Hidden mdDown>
            <Box className="d-flex align-items-center header-left">
              {!props.isCollapsedLayout && (
                <Box
                  className={clsx('btn-toggle-collapse', {
                    'btn-toggle-collapse-closed': sidebarToggle
                  })}>
                  <Tooltip title={sidebarToggle ? i18n.header.openSidebar[lang] : i18n.header.closeSidebar[lang]} placement="right">
                    <IconButton
                      color="inherit"
                      onClick={toggleSidebar}
                      size="medium"
                      className="btn-inverse">
                      {sidebarToggle ? (
                        <MenuRoundedIcon />
                      ) : (
                        <MenuOpenRoundedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <HeaderSearch />
            </Box>
          </Hidden>
          <Box className="d-flex align-items-center header-right">
            {isAuth ? (
              <>
              <HeaderDots />
              <HeaderUserbox />
              </>
            ) : (
              <div className="header-login mr-3 mr-sm-0">
                <Button variant="contained" className="header-login-btn" onClick={() => props.history.push('/login')}>
                  {i18n.header.login[lang]}
                </Button>
              </div>
            )}
            
            <Box className="toggle-sidebar-btn-mobile">
              <Tooltip title="Toggle Sidebar" placement="right">
                <IconButton
                  color="inherit"
                  onClick={toggleSidebarMobile}
                  size="medium">
                  {sidebarToggleMobile ? (
                    <MenuOpenRoundedIcon />
                  ) : (
                    <MenuRoundedIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </AppBar>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    headerShadow: state.ThemeOptions.headerShadow,
    headerFixed: state.ThemeOptions.headerFixed,
    sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile,
    sidebarToggle: state.ThemeOptions.sidebarToggle,
    isAuth: state.auth.isAuth,
    lang: state.auth.lang
  };
}
  

const mapDispatchToProps = dispatch => ({
  setSidebarToggle: enable => dispatch(setSidebarToggle(enable)),
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
