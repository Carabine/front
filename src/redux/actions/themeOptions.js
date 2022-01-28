export const ThemeOptionsActions = {
    // Sidebar
    SET_SIDEBAR_SHADOW: 'THEME_OPTIONS/SET_SIDEBAR_SHADOW',
    SET_SIDEBAR_TOGGLE_MOBILE: 'THEME_OPTIONS/SET_SIDEBAR_TOGGLE_MOBILE',
    SET_SIDEBAR_FIXED:'THEME_OPTIONS/SET_SIDEBAR_FIXED',
    SET_SIDEBAR_FOOTER: 'THEME_OPTIONS/SET_SIDEBAR_FOOTER',
    SET_SIDEBAR_TOGGLE: 'THEME_OPTIONS/SET_SIDEBAR_TOGGLE',
    SET_SIDEBAR_USERBOX: 'THEME_OPTIONS/SET_SIDEBAR_USERBOX',
    SET_SIDEBAR_HOVER: 'THEME_OPTIONS/SET_SIDEBAR_HOVER',
    // Header
    SET_HEADER_FIXED: 'THEME_OPTIONS/SET_HEADER_FIXED',
    SET_HEADER_SHADOW: 'THEME_OPTIONS/SET_HEADER_SHADOW',
    SET_HEADER_SEARCH_HOVER: 'THEME_OPTIONS/SET_HEADER_SEARCH_HOVER',
    // Main content
    SET_CONTENT_BACKGROUND: 'THEME_OPTIONS/SET_CONTENT_BACKGROUND',
    SET_THEME_CONFIGURATOR_TOGGLE: 'THEME_OPTIONS/SET_THEME_CONFIGURATOR_TOGGLE',
    // Footer
    SET_FOOTER_FIXED: 'THEME_OPTIONS/SET_FOOTER_FIXED',
    SET_FOOTER_SHADOW: 'THEME_OPTIONS/SET_FOOTER_SHADOW',
    // Page title
    SET_PAGE_TITLE_STYLE: 'THEME_OPTIONS/SET_PAGE_TITLE_STYLE',
    SET_PAGE_TITLE_BACKGROUND: 'THEME_OPTIONS/SET_PAGE_TITLE_BACKGROUND',
    SET_PAGE_TITLE_SHADOW: 'THEME_OPTIONS/SET_PAGE_TITLE_SHADOW',
    SET_PAGE_TITLE_BREADCRUMB: 'THEME_OPTIONS/SET_PAGE_TITLE_BREADCRUMB',
    SET_PAGE_TITLE_ICON_BOX: 'THEME_OPTIONS/SET_PAGE_TITLE_ICON_BOX',
    SET_PAGE_TITLE_DESCRIPTION: 'THEME_OPTIONS/SET_PAGE_TITLE_DESCRIPTION',
}

// Sidebar
export const setSidebarShadow = sidebarShadow => ({
  type: ThemeOptionsActions.SET_SIDEBAR_SHADOW,
  sidebarShadow
})
export const setSidebarFixed = sidebarFixed => ({
  type: ThemeOptionsActions.SET_SIDEBAR_FIXED,
  sidebarFixed
})
export const setSidebarToggleMobile = sidebarToggleMobile => ({
  type: ThemeOptionsActions.SET_SIDEBAR_TOGGLE_MOBILE,
  sidebarToggleMobile
})
export const setSidebarFooter = sidebarFooter => ({
  type: ThemeOptionsActions.SET_SIDEBAR_FOOTER,
  sidebarFooter
})
export const setSidebarToggle = sidebarToggle => ({
  type: ThemeOptionsActions.SET_SIDEBAR_TOGGLE,
  sidebarToggle
})
export const setSidebarHover = sidebarHover => ({
  type: ThemeOptionsActions.SET_SIDEBAR_HOVER,
  sidebarHover
})
export const setSidebarUserbox = sidebarUserbox => ({
  type: ThemeOptionsActions.SET_SIDEBAR_USERBOX,
  sidebarUserbox
})

// Header
export const setHeaderFixed = headerFixed => ({
  type: ThemeOptionsActions.ThemeOptionsActions.SET_HEADER_FIXED,
  headerFixed
});
export const setHeaderShadow = headerShadow => ({
  type: ThemeOptionsActions.SET_HEADER_SHADOW,
  headerShadow
});
export const setHeaderSearchHover = headerSearchHover => ({
  type: ThemeOptionsActions.SET_HEADER_SEARCH_HOVER,
  headerSearchHover
});

// Main content
export const setContentBackground = contentBackground => ({
  type: ThemeOptionsActions.SET_CONTENT_BACKGROUND,
  contentBackground
})
export const setThemeConfiguratorToggle = themeConfiguratorToggle => ({
  type: ThemeOptionsActions.SET_THEME_CONFIGURATOR_TOGGLE,
  themeConfiguratorToggle
})

// Footer
export const setFooterFixed = footerFixed => ({
  type: ThemeOptionsActions.SET_FOOTER_FIXED,
  footerFixed
});
export const setFooterShadow = footerShadow => ({
  type: ThemeOptionsActions.SET_FOOTER_SHADOW,
  footerShadow
});

// Page title
export const setPageTitleStyle = pageTitleStyle => ({
  type: ThemeOptionsActions.SET_PAGE_TITLE_STYLE,
  pageTitleStyle
});
export const setPageTitleBackground = pageTitleBackground => ({
  type: ThemeOptionsActions.SET_PAGE_TITLE_BACKGROUND,
  pageTitleBackground
});
export const setPageTitleShadow = pageTitleShadow => ({
  type: ThemeOptionsActions.SET_PAGE_TITLE_SHADOW,
  pageTitleShadow
});
export const setPageTitleBreadcrumb = pageTitleBreadcrumb => ({
  type: ThemeOptionsActions.SET_PAGE_TITLE_BREADCRUMB,
  pageTitleBreadcrumb
});
export const setPageTitleIconBox = pageTitleIconBox => ({
  type: ThemeOptionsActions.SET_PAGE_TITLE_ICON_BOX,
  pageTitleIconBox
});
export const setPageTitleDescription = pageTitleDescription => ({
  type: ThemeOptionsActions.SET_PAGE_TITLE_DESCRIPTION,
  pageTitleDescription
});