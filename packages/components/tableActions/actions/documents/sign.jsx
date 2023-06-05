import React, { useCallback } from 'react';
import { Ant, showError } from '@vezubr/elements';
import { Documents as DocumentsService } from '@vezubr/services';
const Sign = (props) => {
  const { loading, record, reload } = props;

  const sign = useCallback(async () => {
    try {
      await DocumentsService.sign(record?.id);
      reload();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [record?.id])
  return (
    <Ant.Button
      loading={loading}
      size="small"
      type={'primary'}
      onClick={sign}
    >
      Подписать
    </Ant.Button>
  );
}

export default Sign;