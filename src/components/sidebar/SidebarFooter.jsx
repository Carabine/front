import React from 'react'
import { InputLabel, MenuItem, FormControl, Select } from '@material-ui/core'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { useSnackbar } from 'notistack';

import { changeLang } from './../../redux/actions/auth'
import { i18n } from './../../utils/i18n'
import { logout } from './../../redux/actions/auth'
import { authAPI } from './../../api/index'



const SidebarFooter = (props) => {
    const { lang, changeLang, logout, isAuth } = props

    const { enqueueSnackbar } = useSnackbar();

    const onChangeLang = async (e) => {
        try {
            await authAPI.changeLang(e.target.value)
            changeLang(e.target.value)
        } catch (err) {
            if(isAuth) {
                enqueueSnackbar(i18n.sidebar.savingLangError[lang], { variant: 'error', autoHideDuration: 3000 });
            } else {
                changeLang(e.target.value)
            }
        }
    }

    return (
        <div className="sidebar-footer">
            <div className="copyright">© 2020 Gilza.com</div>
            <FormControl className={'lang-select'}>
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
            <div className="sidebar-footer-links">
                <div className="link-item">
                    <a href="/" onClick={(e) => { e.preventDefault(); logout(); props.history.push('/login') }}> - {i18n.sidebar.logout[lang]}</a>
                </div>
                <div className="link-item">
                    <Link to="/static/terms"> - {i18n.sidebar.terms[lang]}</Link>
                </div>
                <div className="link-item">
                    <Link to="/static/privacy"> - {i18n.sidebar.privacy[lang]}</Link>
                </div>
                <div className="link-item">
                    <Link to="/static/feedback"> - {i18n.sidebar.feedback[lang]}</Link>
                </div>
                <div className="link-item">
                    <Link to="/static/about"> - {i18n.sidebar.about[lang]}</Link>
                </div>
                <div className="link-item">
                    <Link to="/static/contribute"> - {i18n.sidebar.contribute[lang]}</Link>
                </div>
            </div>
        </div>
    )
}

const mstp = (state) => ({
    lang: state.auth.lang,
    isAuth: state.auth.isAuth
})

export default withRouter(connect(mstp, { changeLang, logout })(SidebarFooter))
