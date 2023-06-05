import React from 'react';

const Header = ({ children, className }) => {
  const getClassNames = () => {
    let classNames = ['main-header', className];

    return classNames.join(' ');
  };

  return (
    <header className={getClassNames()}>
      <div className="container">
        <header className="clearfix">{children}</header>
      </div>
    </header>
  );
};

export default Header;
