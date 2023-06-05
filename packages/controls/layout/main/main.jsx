import React from 'react';
import PropTypes from 'prop-types';

function Main({ children, className }) {
  return (
    <main className={className}>
      <div className="container">{children}</div>
    </main>
  );
}

Main.propTypes = {
  children: PropTypes.node,
};

export default Main;
