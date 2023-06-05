import React from 'react';
import { Ant } from '@vezubr/elements';
const ReloadDummy = (props) => {
  const { reload } = props;
  return (
    <Ant.Button onClick={reload}>
      reload
    </Ant.Button>
  )
}

export default ReloadDummy;