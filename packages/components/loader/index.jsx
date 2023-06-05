import React from 'react';
const Loader = (props) => {
  return (
    <div id="loader">
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </div>
  );
};

export default Loader;
