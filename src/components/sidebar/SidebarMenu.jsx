import React from 'react';
import { matchPath } from 'react-router-dom';

import PropTypes from 'prop-types';

import { List, Typography } from '@material-ui/core';

import useRouter from './../../utils/useRouter';
import SidebarMenuListItem from './SidebarMenuListItem';
import { i18n } from './../../utils/i18n'

const SidebarMenuList = props => {
  const { pages, ...rest } = props;

  return (
    <List className="p-0">
      {pages.reduce(
        (items, page) => reduceChildRoutes({ items, page, ...rest }),
        []
      )}
    </List>
  );
};

SidebarMenuList.propTypes = {
  depth: PropTypes.number,
  pages: PropTypes.array
};

const reduceChildRoutes = props => {
  const { router, items, page, depth, lang } = props;

  if (page.content) {
    const open = matchPath(router.location.pathname, {
      path: page.to,
      exact: false
    });

    
    items.push(
      <SidebarMenuListItem
        depth={depth}
        icon={page.icon}
        key={i18n.sidebar[page.label][lang]}
        label={page.badge}
        open={true}
        title={i18n.sidebar[page.label][lang]}>
        <div className="sidebar-menu-children py-2">
          <SidebarMenuList
            depth={depth + 1}
            pages={page.content}
            router={router}
            lang={lang}
          />
        </div>
      </SidebarMenuListItem>
    );
  } else {
    items.push(
      <SidebarMenuListItem
        depth={depth}
        href={page.to}
        icon={page.icon}
        key={i18n.sidebar[page.label][lang]}
        label={page.badge}
        title={i18n.sidebar[page.label][lang]}
      />
    );
  }

  return items;
};

const SidebarMenu = props => {
  const { title, pages, className, component: Component, lang, ...rest } = props;

  const router = useRouter();

  return (
    <Component {...rest} className={className}>
      {title && (
        <Typography className="app-sidebar-heading">{title}</Typography>
      )}
      <SidebarMenuList depth={0} pages={pages} router={router} lang={lang} />
    </Component>
  );
};

SidebarMenu.propTypes = {
  className: PropTypes.string,
  component: PropTypes.any,
  pages: PropTypes.array.isRequired,
  title: PropTypes.string
};

SidebarMenu.defaultProps = {
  component: 'nav'
};

export default SidebarMenu;
