import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { IconButton, Box } from '@material-ui/core';

import { connect } from 'react-redux';

import projectLogo from '../../logo.svg';

const HeaderLogo = props => {
  const { sidebarToggle, sidebarHover } = props;
  return (
    <Fragment>
      <div
        className={clsx('app-header-logo', {
          'app-header-logo-close': sidebarToggle,
          'app-header-logo-open': sidebarHover
        })}>
        <Box
          className="header-logo-wrapper"
          title="Gilza">
          <Link to="/" className="header-logo-wrapper-link">
            <IconButton
              color="primary"
              size="medium"
              style={{backgroundColor: 'white'}}
              className="header-logo-wrapper-btn">
              <img
                className="app-header-logo-img"
                alt="Gilza"
                src={projectLogo}
              />
            </IconButton>
          </Link>
          {/* <Box className="header-logo-text">Gilza</Box> */}
        </Box>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  sidebarToggle: state.ThemeOptions.sidebarToggle,
  sidebarHover: state.ThemeOptions.sidebarHover
});

export default connect(mapStateToProps)(HeaderLogo);
