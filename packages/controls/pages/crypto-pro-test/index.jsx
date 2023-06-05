import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Page, WhiteBox } from '@vezubr/elements';
import { CryptoPro } from '@vezubr/components';

function CryptoProTest(props) {
  return (
    <div className={'crypto-pro-page'}>
      <CryptoPro />
    </div>
  );
}

export default CryptoProTest;
