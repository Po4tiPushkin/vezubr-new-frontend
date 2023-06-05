import React from 'react';
import PropTypes from 'prop-types';
import _uniq from 'lodash/uniq';
import loaderTariffList from '../../loaders/loaderTariffList';
import { showError } from '@vezubr/elements';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { Ant } from '@vezubr/elements';

function TariffListTagByIds(props) {
  const { color = 'geekblue', tariffListHash: tariffListHashInput, ids } = props;

  const [loadingData, setLoadingData] = React.useState(false);
  const [tariffListHash, setTariffListHash] = React.useState(tariffListHashInput || {});

  const tariffListHashPrev = usePrevious(tariffListHashInput);

  React.useEffect(() => {
    if (!tariffListHashInput) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          setTariffListHash(await loaderTariffList.getHash());
        } catch (e) {
          console.error(e);
          showError(e);
        }

        setLoadingData(false);
      };

      fetchData();

      return () => {
        loaderTariffList.unload();
      };
    } else if (tariffListHashPrev !== tariffListHashInput) {
      setTariffListHash(tariffListHashInput);
    }
  }, [tariffListHashInput]);

  return (
    <div className="tariff-list-tag">
      {loadingData && <Ant.Spin size="small" />}
      {!loadingData &&
        _uniq(ids).map((id) => (
          <Ant.Tag key={id} size={'small'} color={color}>
            {tariffListHash?.[id]?.title || `Неизвестный тариф: ${id}`}
          </Ant.Tag>
        ))}
    </div>
  );
}

TariffListTagByIds.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string,
  tariffListHash: PropTypes.object,
};

export default TariffListTagByIds;
