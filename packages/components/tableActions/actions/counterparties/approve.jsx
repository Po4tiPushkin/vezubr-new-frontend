import { showError } from '@vezubr/elements';
import { Button } from '@vezubr/elements/antd';
import { Contractor as ContractorService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

function Approve(props, context) {
  const { observer } = context;

  const { onUpdated, contourId, contractorId, textButton: textButtonInput, ...otherProps } = props;

  const [loading, setLoading] = useState(false);

  const approve = useCallback(async () => {
    setLoading(true);
    try {
      await ContractorService.approve({
        contour: contourId,
        contractor: contractorId,
      });
      onUpdated();
    } catch (e) {
      console.error(e);
      showError(e)
    }
    setLoading(false);
  }, [contractorId, contourId]);

  const textButton = textButtonInput || 'Принять в контур';

  return (
    <Button loading={loading} size="small" type={'primary'} {...otherProps} onClick={approve}>
      {textButton}
    </Button>
  );
}

Approve.propTypes = {
  textButton: PropTypes.node,
  onUpdated: PropTypes.func,
  contourId: PropTypes.number,
  contractorId: PropTypes.number,
};

Approve.contextTypes = {
  observer: PropTypes.object,
};

export default Approve;
