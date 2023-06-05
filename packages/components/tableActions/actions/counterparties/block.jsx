import { Ant, showConfirm, showError } from '@vezubr/elements';
import { Contractor as ContractorService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

function Block(props) {
  const { record, reload } = props;
  const blocked = useMemo(() => record?.contours?.[0]?.status !== 2, [record]);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const onOk = React.useCallback(async () => {
    try {
      await ContractorService.switchStatus(record?.id, {
        status: blocked ? 2 : 4,
      });
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [blocked, record]);

  const block = useCallback(async () => {
    setLoading(true);
    try {
      showConfirm({
        title: 'Вы уверены?',
        onOk: async () => {
          onOk();
        },
      });
    } catch (e) {}
    setLoading(false);
  }, [record]);

  const textButton = blocked ? 'Разблокировать' : 'Заблокировать';

  return (
    <Ant.Button
      disabled={!IS_ADMIN}
      loading={loading}
      size="small"
      type={blocked ? 'primary' : 'outlined'}
      onClick={block}
    >
      {textButton}
    </Ant.Button>
  );
}

Block.propTypes = {
  record: PropTypes.object.isRequired,
};

export default Block;
