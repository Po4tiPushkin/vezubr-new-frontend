import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import { getSafePath } from '../infrastructure';
import { matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import { FilterButton } from '@vezubr/elements';
import useWindowSize from '@vezubr/common/hooks/useWindowSize'
export const TabItemProps = {
  title: PropTypes.node.isRequired,
  params: PropTypes.object,
  disabled: PropTypes.bool,
  linkParams: PropTypes.shape({
    search: PropTypes.string,
    hash: PropTypes.string,
    state: PropTypes.object,
  }),
  additionalRoutesMatch: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.object.isRequired,
      params: PropTypes.object,
    }),
  ),
  route: PropTypes.object.isRequired,
  attrs: PropTypes.object,
};

function Tabs(props) {
  const {
    router: routerState,
    items: itemsInput,
    attrs: attrsInput,
    viewIsNotMatched,
    adaptForMobile = false,
    menuOpts = {},
  } = props;
  const [showBurger, setShowBurger] = useState(false);
  const { width } = useWindowSize();
  const { matchedCount, hasActive, renderedItems } = useMemo(() => {
    let matchedCount = 0;
    let hasActive = false;

    const renderedItems = [];

    loopItems: for (let key = 0; key < itemsInput.length; key++) {
      const item = itemsInput[key];

      const {
        title,
        attrs: attrsInput,
        params,
        route,
        additionalRoutesMatch,
        disabled,
        linkParams,
        className,
        show,
        id,
      } = item;

      const routers = [{ route, params }, ...(additionalRoutesMatch || [])];

      let active = false;

      let mainPath = null;

      let matched = false;

      for (let index = 0; index < routers.length; index++) {
        const currRoute = routers[index].route;
        const currParams = routers[index]?.params || {};

        const path = getSafePath(currRoute, currParams, routerState);

        matched = !!matchPath(routerState.location.pathname, currRoute);

        if (index === 0) {
          if (!path) {
            continue loopItems;
          }
          active = path === location.pathname;
          hasActive = hasActive || active;
          mainPath = path;
        }
      }

      if (matched) {
        matchedCount++;
      }

      const routeAttrs = {
        ...attrsInput,
        to: {
          pathname: mainPath,
          ...linkParams,
        },
        disabled: disabled || active,
      };

      const attrs = {
        ...routeAttrs,
        className: cn('vz-tabs-modern__item', { active, matched }, className),
      };

      if (show !== false) {
        renderedItems.push(
          <Link {...attrs} id={id} key={key}>
            {title}
          </Link>,
        );
      }
    }

    return {
      hasActive,
      matchedCount,
      renderedItems,
    };
  }, [itemsInput, routerState]);

  const burgerRender = useMemo(() => {
    if (!adaptForMobile || width > adaptForMobile) {
      return null;
    }
    return <FilterButton
      icon={'dotsBlue'}
      onClick={() => setShowBurger(prev => !prev)}
      onClose={() => setShowBurger(false)}
      className={'vz-tabs-burger'}
      withMenu={true}
      menuOptions={{ nodes: true, list: renderedItems, show: showBurger, ...menuOpts }}
    />
  }, [renderedItems, showBurger, adaptForMobile, width, menuOpts])

  const attrs = {
    ...attrsInput,
    className: cn(
      'vz-tabs-modern',
      { 'vz-tabs-modern--has-no-active': !hasActive },
      `vz-tabs-modern--has-matched-count-${matchedCount}`,
      { 'vz-tabs-modern-mobile': !!burgerRender },
      attrsInput && attrsInput.className,
    ),
  };

  if (matchedCount > 0 || viewIsNotMatched) {
    return <div {...attrs}>{burgerRender ? burgerRender : renderedItems}</div>;
  }

  return null;
}

Tabs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(TabItemProps)),
  router: PropTypes.object.isRequired,
  viewIsNotMatched: PropTypes.bool,
  attrs: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const { router } = state;
  return {
    router,
  };
};

export default connect(mapStateToProps)(Tabs);
