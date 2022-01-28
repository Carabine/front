import { ThemeOptionsActions } from './../actions/themeOptions'

const initialState = {
    // Sidebar
    sidebarShadow: false,
    sidebarFixed: true,
    sidebarToggleMobile: false,
    sidebarFooter: true,
    sidebarUserbox: true,
    sidebarToggle: false,
    sidebarHover: false,
    // Header
    headerFixed: true,
    headerShadow: true,
    headerSearchHover: false,
    // Main content
    contentBackground: '',
    themeConfiguratorToggle: false,
    // Footer
    footerFixed: false,
    footerShadow: false,
    // Page title
    pageTitleStyle: '',
    pageTitleBackground: '',
    pageTitleShadow: false,
    pageTitleBreadcrumb: false,
    pageTitleIconBox: true,
    pageTitleDescription: true
}

export const themeOptionsReducer = (state = initialState, action) => {
    switch (action.type) {
        // Sidebar
        case ThemeOptionsActions.SET_SIDEBAR_SHADOW:
            return {
                ...state,
                sidebarShadow: action.sidebarShadow
            }
        case ThemeOptionsActions.SET_SIDEBAR_FIXED:
            return {
                ...state,
                sidebarFixed: action.sidebarFixed
            }
        case ThemeOptionsActions.SET_SIDEBAR_TOGGLE_MOBILE:
            return {
                ...state,
                sidebarToggleMobile: action.sidebarToggleMobile
            }
        case ThemeOptionsActions.SET_SIDEBAR_FOOTER:
            return {
                ...state,
                sidebarFooter: action.sidebarFooter
            }
        case ThemeOptionsActions.SET_SIDEBAR_TOGGLE:
            return {
                ...state,
                sidebarToggle: action.sidebarToggle
            }
        case ThemeOptionsActions.SET_SIDEBAR_HOVER:
            return {
                ...state,
                sidebarHover: action.sidebarHover
            }
        case ThemeOptionsActions.SET_SIDEBAR_USERBOX:
            return {
                ...state,
                sidebarUserbox: action.sidebarUserbox
            }
        // Header
        case ThemeOptionsActions.SET_HEADER_FIXED:
            return {
                ...state,
                headerFixed: action.headerFixed
            }
        case ThemeOptionsActions.SET_HEADER_SHADOW:
            return {
                ...state,
                headerShadow: action.headerShadow
            }
        case ThemeOptionsActions.SET_HEADER_SEARCH_HOVER:
            return {
                ...state,
                headerSearchHover: action.headerSearchHover
            }
        // Main content
        case ThemeOptionsActions.SET_CONTENT_BACKGROUND:
            return {
                ...state,
                contentBackground: action.contentBackground
            }
        case ThemeOptionsActions.SET_THEME_CONFIGURATOR_TOGGLE:
            return {
                ...state,
                themeConfiguratorToggle: action.themeConfiguratorToggle
            }
        // Footer
        case ThemeOptionsActions.SET_FOOTER_FIXED:
            return {
                ...state,
                footerFixed: action.footerFixed
            }
        case ThemeOptionsActions.SET_FOOTER_SHADOW:
            return {
                ...state,
                footerShadow: action.footerShadow
            }
        // Page title
        case ThemeOptionsActions.SET_PAGE_TITLE_STYLE:
            return {
                ...state,
                pageTitleStyle: action.pageTitleStyle
            }
        case ThemeOptionsActions.SET_PAGE_TITLE_BACKGROUND:
            return {
                ...state,
                pageTitleBackground: action.pageTitleBackground
            }
        case ThemeOptionsActions.SET_PAGE_TITLE_SHADOW:
            return {
                ...state,
                pageTitleShadow: action.pageTitleShadow
            }
        case ThemeOptionsActions.SET_PAGE_TITLE_BREADCRUMB:
            return {
                ...state,
                pageTitleBreadcrumb: action.pageTitleBreadcrumb
            }
        case ThemeOptionsActions.SET_PAGE_TITLE_ICON_BOX:
            return {
                ...state,
                pageTitleIconBox: action.pageTitleIconBox
            }
        case ThemeOptionsActions.SET_PAGE_TITLE_DESCRIPTION:
            return {
                ...state,
                pageTitleDescription: action.pageTitleDescription
            }
        default:
            return state;
    }
}