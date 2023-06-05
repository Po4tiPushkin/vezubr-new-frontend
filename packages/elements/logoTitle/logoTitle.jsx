import React from 'react';
import PropTypes from 'prop-types';
import Utils from '@vezubr/common/common/utils';

const logoTitle = DOMAIN_VERSION;

function Logo({ className, user }) {

  const [image, setImage] = React.useState(null)

  React.useEffect(() => {
    if (user) {
      setImage(Utils.concatImageUrl(getLogoUrl(user)))
    }
  }, [user])

  const getLogoUrl = (data) => {
    let logoUrl = '';
    if (APP === 'operator') {
      logoUrl = data.logoFile_doc?.downloadUrl;
    } else {
      logoUrl = data.logo?.downloadUrl;
    }
    return logoUrl;
  }

  if (image) {
    return (
      <div className={'logo-image image'}>
        <img src={image} />
      </div>
    )
  } else {
    return (
      <h1 className={`logo ${className || 'main-title'}`}>{logoTitle.toUpperCase()}</h1>
    );
  }
}

Logo.propTypes = {
  children: PropTypes.node,
};

export default Logo;
