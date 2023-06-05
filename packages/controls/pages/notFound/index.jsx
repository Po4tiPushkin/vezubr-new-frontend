import React from 'react';

const NotFound = ({ location }) => {
  return (
    <h1>Раздел {location.pathname.substring(1)} находится в разработке.</h1>
  );
};

export default NotFound;
