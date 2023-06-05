import React, { useCallback, useContext } from 'react';
import { observer } from "mobx-react";
import { connect } from 'react-redux';
import { Ant, showError, VzTable, WhiteBox } from '@vezubr/elements';
import { CargoPlace as CargoPlaceService } from '@vezubr/services';
import { CargoContextView } from '../../context';
import useCancelableLoadData from "@vezubr/common/hooks/useCancelableLoadData";
import useColumns from './useColumns';


function Nested(props) {
    const { match, dictionaries } = props;
    const id = match.params.id;
    const { store } = useContext(CargoContextView);
    const [columns, width] = useColumns({ dictionaries });

    const fetchData = useCallback(async () => {
        store.setLoaderIncluded(true);
        try {
          const response = await CargoPlaceService.cargoIncluded(id);
          store.setDirtyDataIncluded(response);
        } catch (e) {
          showError(e)
        } finally {
          store.setLoaderIncluded(false);
          store.setLoadedIncluded(true);
        }

        return null
      }, [id]);
      const [, loading] = useCancelableLoadData(fetchData);
    

    return(
         <div className={'cargo-view-tab-bargain'}>
            {store.isLoaded ? (
                <VzTable.Table 
                    dataSource={store.dataIncluded} 
                    columns={columns}
                    rowKey={'status'}
                    scroll={{ x: width, y: 500 }}
                />
            ) : (
				      <WhiteBox>
                <Ant.Skeleton active={true} paragraph={{ rows: 10 }} />
              </WhiteBox>
            )}
         </div>
  
    )

}

const mapStateToProps = (state) => {
  const { dictionaries } = state;
  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(observer(Nested));