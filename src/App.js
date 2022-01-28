import React, { useEffect } from "react";
import { connect } from 'react-redux'
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DocumentMeta from 'react-document-meta'
import { AnimatePresence, motion } from 'framer-motion';
import { SnackbarProvider } from 'notistack';


// позже разберусь, какие стили нужны - какие нет
import './assets/theme-styles/base.scss';

import { Preloader } from "./components/common/Preloader";
import LoginContainer from './components/login/Login'
import { auth} from './redux/actions/auth'
import ProjectsList from './components/projectsList/ProjectsList'
import Mediafiles from './components/mediafiles/Mediafiles'
import ContainersList from './components/containersList/ContainersList'
import CreateContainer from './components/containersList/CreateContainer'
import PublicProjectWithEstimates from './components/publicProject/PublicProjectWithEstimates'
import EditContainer from './components/containersList/EditContainer'
import { Requests } from './components/requests/Requests'
import {i18n} from './utils/i18n'
import { SingleVideoContainer } from './components/singleVideo/SingleVideo'
import LeftSidebar from './components/leftSidebar/LeftSidebar'
import MuiTheme from './theme';
import PublicProjectsList from './components/publicProjectsList/PublicProjectsList'
import { PrivateRoute } from './components/common/PrivateRoute'
import PublicProfile from './components/publicProfile/PublicProfile'
import Settings from './components/settings/Settings'
import { useTracking } from './components/common/useTracking'
import StaticComponent from './components/staticComponent/StaticComponent'

// потом уберу ненужные иконки
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fab,
  faFacebook,
  faTwitter,
  faVuejs,
  faReact,
  faHtml5,
  faGoogle,
  faInstagram,
  faPinterest,
  faYoutube,
  faDiscord,
  faSlack,
  faDribbble,
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import {
  far,
  faSquare,
  faLifeRing,
  faCheckCircle,
  faTimesCircle,
  faDotCircle,
  faThumbsUp,
  faComments,
  faFolderOpen,
  faTrashAlt,
  faFileImage,
  faFileArchive,
  faCommentDots,
  faFolder,
  faKeyboard,
  faCalendarAlt,
  faEnvelope,
  faAddressCard,
  faMap,
  faObjectGroup,
  faImages,
  faUser,
  faLightbulb,
  faGem,
  faClock,
  faUserCircle,
  faQuestionCircle,
  faBuilding,
  faBell,
  faFileExcel,
  faFileAudio,
  faFileVideo,
  faFileWord,
  faFilePdf,
  faFileCode,
  faFileAlt,
  faEye,
  faChartBar
} from '@fortawesome/free-regular-svg-icons';
import {
  fas,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faSmile,
  faHeart,
  faBatteryEmpty,
  faBatteryFull,
  faChevronRight,
  faSitemap,
  faPrint,
  faMapMarkedAlt,
  faTachometerAlt,
  faAlignCenter,
  faExternalLinkAlt,
  faShareSquare,
  faInfoCircle,
  faSync,
  faQuoteRight,
  faStarHalfAlt,
  faShapes,
  faCarBattery,
  faTable,
  faCubes,
  faPager,
  faCameraRetro,
  faBomb,
  faNetworkWired,
  faBusAlt,
  faBirthdayCake,
  faEyeDropper,
  faUnlockAlt,
  faDownload,
  faAward,
  faPlayCircle,
  faReply,
  faUpload,
  faBars,
  faEllipsisV,
  faSave,
  faSlidersH,
  faCaretRight,
  faChevronUp,
  faPlus,
  faLemon,
  faChevronLeft,
  faTimes,
  faChevronDown,
  faFilm,
  faSearch,
  faEllipsisH,
  faCog,
  faArrowsAltH,
  faPlusCircle,
  faAngleRight,
  faAngleUp,
  faAngleLeft,
  faAngleDown,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faArrowLeft,
  faStar,
  faSignOutAlt,
  faLink
} from '@fortawesome/free-solid-svg-icons';
library.add(
  far,
  faSquare,
  faLifeRing,
  faCheckCircle,
  faTimesCircle,
  faDotCircle,
  faThumbsUp,
  faComments,
  faFolderOpen,
  faTrashAlt,
  faFileImage,
  faFileArchive,
  faCommentDots,
  faFolder,
  faKeyboard,
  faCalendarAlt,
  faEnvelope,
  faAddressCard,
  faMap,
  faObjectGroup,
  faImages,
  faUser,
  faLightbulb,
  faGem,
  faClock,
  faUserCircle,
  faQuestionCircle,
  faBuilding,
  faBell,
  faFileExcel,
  faFileAudio,
  faFileVideo,
  faFileWord,
  faFilePdf,
  faFileCode,
  faFileAlt,
  faEye,
  faChartBar
);
library.add(
  fab,
  faFacebook,
  faTwitter,
  faVuejs,
  faReact,
  faHtml5,
  faGoogle,
  faInstagram,
  faPinterest,
  faYoutube,
  faDiscord,
  faSlack,
  faDribbble,
  faGithub
);
library.add(
  fas,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faSmile,
  faHeart,
  faBatteryEmpty,
  faBatteryFull,
  faChevronRight,
  faSitemap,
  faPrint,
  faMapMarkedAlt,
  faTachometerAlt,
  faAlignCenter,
  faExternalLinkAlt,
  faShareSquare,
  faInfoCircle,
  faSync,
  faQuoteRight,
  faStarHalfAlt,
  faShapes,
  faCarBattery,
  faTable,
  faCubes,
  faPager,
  faCameraRetro,
  faBomb,
  faNetworkWired,
  faBusAlt,
  faBirthdayCake,
  faEyeDropper,
  faUnlockAlt,
  faDownload,
  faAward,
  faPlayCircle,
  faReply,
  faUpload,
  faBars,
  faEllipsisV,
  faSave,
  faSlidersH,
  faCaretRight,
  faChevronUp,
  faPlus,
  faLemon,
  faChevronLeft,
  faTimes,
  faChevronDown,
  faFilm,
  faSearch,
  faEllipsisH,
  faCog,
  faArrowsAltH,
  faPlusCircle,
  faAngleRight,
  faAngleUp,
  faAngleLeft,
  faAngleDown,
  faArrowUp,
  faArrowDown,
  faArrowRight,
  faArrowLeft,
  faStar,
  faSignOutAlt,
  faLink
)
 
export const App = ({isAuth, initialized, auth, lang}) => {
  const location = useLocation();
  useTracking('UA-177864526-1')

  useEffect(() => {
      auth()
  }, [])
  
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
      <>
        <CssBaseline />   
        <ThemeProvider theme={MuiTheme}>
          <SnackbarProvider maxSnack={3}>
            <AnimatePresence>
              <Switch>
                <Redirect exact from="/" to="/main" />
                <Route 
                    path={[
                        '/projects/:projectId/video',
                        '/public/:projectId',
                    ]}>
                      <Switch location={location} key={location.pathname}>
                          <Route exact path="/projects/:projectId/video" render={() => <SingleVideoContainer />} />
                          <Route exact path="/public/:projectId" render={() => <PublicProjectWithEstimates key={document.title} />} />
                      </Switch>
                </Route> 
                <Route
                    path={[
                      '/login',
                      '/public/:projectId',
                      '/projects/:projectId/edit/:containerId',
                      '/projects/:projectId',
                      '/projects',
                      '/mediafiles',
                      '/create/:projectId',
                      '/request',
                      '/main/:category?',
                      '/users/:login',
                      '/settings',
                      '/static/:page',
                      '/test'
                    ]}
                    >
                  {!initialized ? (
                      <>
                        <div className="preloader-page">
                            <Preloader />
                        </div>
                      </>
                  ) : (
                      <LeftSidebar>
                          <Switch location={location} key={location.pathname}>
                            <motion.div
                              initial="initial"
                              animate="in"
                              exit="out"
                              variants={pageVariants}
                              transition={pageTransition}
                              className="motion-div"
                              >
                              <Route exact path="/login" render={LoginContainer} />
                              <Route exact path="/public/:projectId" component={PublicProjectWithEstimates} key={document.title} />
                              <Route exact path='/main/:category?' component={PublicProjectsList} />
                              <Route exact path='/users/:login' component={PublicProfile} /*key={document.title}*/ />
                              <Route exact path='/static/:page' component={StaticComponent} />
                             

                              <PrivateRoute exact path="/projects/:projectId" authed={isAuth} component={ContainersList} />
                              <PrivateRoute exact path="/projects/:projectId/edit/:containerId" authed={isAuth} component={EditContainer} />
                              <PrivateRoute exact path="/projects" authed={isAuth} component={ProjectsList} />
                              <PrivateRoute exact path="/mediafiles" authed={isAuth} component={Mediafiles} />
                              <PrivateRoute exact path="/create/:projectId" authed={isAuth} component={CreateContainer} />
                              <PrivateRoute exact path="/request" authed={isAuth} component={Requests} />
                              <PrivateRoute exact path="/settings" authed={isAuth} component={Settings} />
                            </motion.div>
                          </Switch>
                      </LeftSidebar>
                  )}
                </Route>   
              </Switch>
            </AnimatePresence>
          </SnackbarProvider>
        </ThemeProvider>
      </>
  )
}

const mstp = (state) => ({
    isAuth: state.auth.isAuth,
    initialized: state.auth.initialized, 
    lang: state.auth.lang
})

export const AppContainer = connect(mstp, {auth})(App)

