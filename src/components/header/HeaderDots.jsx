import React from 'react';
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import FolderIcon from '@material-ui/icons/Folder';
import HelpIcon from '@material-ui/icons/Help';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import {
    IconButton,
    Box
  } from '@material-ui/core';
import {NavLink} from 'react-router-dom'

const HeaderDots = () => {
    return (
        <>  
            <div className="d-flex align-items-center popover-header-wrapper">
                <Box component="span" pr="2">
                    <a style={{color: 'inherit'}} href="javascript:void(Tawk_API.toggle())">
                        <IconButton
                        color="inherit"
                        className="btn-inverse mx-1 d-50"> 
                            <HelpIcon />
                        </IconButton>
                    </a>
                </Box>
            </div>
            <div className="d-flex align-items-center popover-header-wrapper">
                <Box component="span" pr="2">
                    <NavLink style={{color: 'inherit'}} to="/projects">
                        <IconButton
                        color="inherit"
                        className="btn-inverse mx-1 d-50"> 
                            <FolderIcon />
                        </IconButton>
                    </NavLink>
                </Box>
            </div>
            <div className="d-flex align-items-center popover-header-wrapper">
                <Box component="span" pr="2">
                    <NavLink style={{color: 'inherit'}} to="/mediafiles">
                        <IconButton
                        color="inherit"
                        className="btn-inverse mx-1 d-50"> 
                            <VideoLibraryIcon />
                        </IconButton>
                    </NavLink>
                </Box>
            </div>
            
            {/* <div className="d-flex align-items-center popover-header-wrapper">
                <Box component="span" pr="2">
                    <NavLink style={{color: 'inherit'}} to="/chat">
                        <IconButton
                        color="inherit"
                        className="btn-inverse mx-1 d-50"> 
                            <div className="badge badge-pill badge-warning badge-header">
                                1
                            </div>
                            <QuestionAnswerIcon />
                        </IconButton>
                    </NavLink>
                </Box>
            </div>
            <div className="d-flex align-items-center popover-header-wrapper">
                <Box component="span" pr="2">
                    <NavLink style={{color: 'inherit'}} to="/">
                        <IconButton
                        color="inherit"
                        className="btn-inverse mx-1 d-50">   
                            <div className="badge badge-pill badge-warning badge-header">
                                3
                            </div>
                            <NotificationsActiveTwoToneIcon /> 
                        </IconButton>
                    </NavLink>
                </Box>
            </div>  */}
        </>
    )
}

export default HeaderDots