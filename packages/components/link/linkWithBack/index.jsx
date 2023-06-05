import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import useGetBackState from '@vezubr/common/hooks/useGetBackState';

function LinkWithBack(props) {
  const { to, className: classNameInput, location, ...otherProps } = props;

  const className = cn('link-back', classNameInput);

  const state = useGetBackState(location);

  const linkProps = {
    ...otherProps,
    className,
    to: {
      ...to,
      state,
    },
  };

  return <Link {...linkProps} />;
}

LinkWithBack.propTypes = {
  to: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    hash: PropTypes.string,
  }),
  location: PropTypes.object,
};

export default LinkWithBack;
