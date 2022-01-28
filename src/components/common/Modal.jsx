import React, {useState, useEffect} from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { i18n } from '../../utils/i18n'


export const Modal = ({isOpen, setOpen, lang, content, fullWidth, maxWidth, extraClasses = '', error, fullScreen}) => {
    const [currentError, setCurrentError] = useState('')

    useEffect(() => {
        if(error) {
            setCurrentError(error)
        }
    }, [error])
    

    const className = "dialog-wrapper " + extraClasses
    return (
        <Dialog open={isOpen}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={className}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                fullScreen={fullScreen}
        >
            <div className="close" onClick={() => setOpen(false)}></div>
            {content ? (
                content
            ) : (
                <>
                    <DialogTitle id="alert-dialog-title">{i18n.authPage.error[lang]}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {currentError}
                        </DialogContentText>
                    </DialogContent>
                </>
            )}
        </Dialog>
    )
}