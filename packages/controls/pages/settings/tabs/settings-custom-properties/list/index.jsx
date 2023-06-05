import t from '@vezubr/common/localization';
import { VzTableFiltered } from '@vezubr/components';
import { ButtonDeprecated, EmptyBlockDeprecated, showError } from '@vezubr/elements';
import { Profile as ProfileService } from '@vezubr/services';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';

function CustomPropsList(props) {
  const dispatch = useDispatch();
  const history = useHistory()

  const [loadingData, setLoadingData] = React.useState(false);

  const dictionaries = useSelector((state) => state.dictionaries);
  const customProperties = useSelector(state => state.customProperties);

  const fetchData = React.useCallback(async () => {
    setLoadingData(true);
    try {
      const dataSource = await ProfileService.getCustomPropsList();
      dispatch({ type: 'SET_CUSTOM_PROPERTIES', payload: dataSource });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  }, [])

  const reloadCustomProps = React.useCallback(async () => {
    await fetchData()
  }, [])

  const [columns, width] = useColumns({ reloadCustomProps, history, dictionaries })

  // React.useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className={'center size-1'}>
      {!customProperties.length ? <EmptyBlockDeprecated theme={'customProps'} /> : null}
      {customProperties.length ? (
        <>
          <VzTableFiltered.TableFiltered
            {...{
              loading: loadingData,
              dataSource: customProperties,
              columns,
              rowKey: 'id',
              width,
              scroll: { x: width, y: 450 },
              responsive: false,
            }}
          />
        </>
      ) : null}
      <div className={'margin-top-15 flexbox justify-right'}>
        <ButtonDeprecated theme={'primary'} onClick={() => history.push('/settings/custom-props/add')} className={'mid'}>
          {t.profile('addCustomProp')}
        </ButtonDeprecated>
      </div>
    </div>
  )
}

export default CustomPropsList;
