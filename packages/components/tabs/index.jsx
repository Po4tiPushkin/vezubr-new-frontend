import React, { useState, useMemo } from 'react';
import cn from 'classnames';
import { getSafePath } from '@vezubr/common/routing';
import { matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import { FilterButton } from '@vezubr/elements';
import useWindowSize from '@vezubr/common/hooks/useWindowSize'
import { useSelector } from 'react-redux';
const Tabs = (props) => {
  const { items: itemsInput, attrs: attrsInput, viewIsNotMatched, adaptForMobile = false } = props;
  const [showBurger, setShowBurger] = useState(false);
  const { width } = useWindowSize();
  const routerState = useSelector(state => state.router);
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
      menuOptions={{ nodes: true, list: renderedItems, show: showBurger }}
    />
  }, [renderedItems, showBurger, adaptForMobile, width])

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

export default Tabs;
