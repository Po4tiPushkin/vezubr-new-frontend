import Utils from '@vezubr/common/common/utils';
import { showError } from '@vezubr/elements';
import { Button } from '@vezubr/elements/antd';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

function SwitchToAnotherLK(props, context) {
  const { observer } = context;

  const { lkId } = props;

  const [loading, setLoading] = useState(false);

  const switchToAnotherLK = useCallback(async () => {
    setLoading(true);
    try {
      await Utils.switchToDelegated(lkId)
    } catch (e) {
      console.error(e);
      showError(e)
    }
    setLoading(false);
  }, []);

  const textButton = 'Перейти в ЛК контрагента';

  return (
    <Button loading={loading} size="small" type={'primary'} onClick={switchToAnotherLK}>
      {textButton}
    </Button>
  );
}

SwitchToAnotherLK.propTypes = {
  lkId: PropTypes.number.isRequired
};

SwitchToAnotherLK.contextTypes = {
  observer: PropTypes.object,
};

export default SwitchToAnotherLK;
