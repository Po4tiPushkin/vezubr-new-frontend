import React from 'react';
import PropTypes from 'prop-types';
import useGoBack from '@vezubr/common/hooks/useGoBack';

function LinkGoBackRenderProps(props, context) {
  const { children, defaultUrl, location = window.location } = props;
  const { history } = context;
  const goBack = useGoBack({ location, history, defaultUrl });
  return children(goBack);
}

LinkGoBackRenderProps.propTypes = {
  location: PropTypes.object,
  children: PropTypes.func.isRequired,
  defaultUrl: PropTypes.string.isRequired,
};

LinkGoBackRenderProps.contextTypes = {
  history: PropTypes.object,
};

export default LinkGoBackRenderProps;
