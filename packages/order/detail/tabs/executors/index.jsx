import React, { useContext, useMemo } from "react";
import useExecutorsInfo from "./hooks/useExecutorsInfo";
import { PreparatorsSingle } from '@vezubr/components';
import { VzEmpty, WhiteBox } from '@vezubr/elements';
import { fileOpenInWindow } from "@vezubr/common/utils";
import { useSelector } from "react-redux";
import OrderViewContext from '../../context';
const OrderViewExecutors = (props) => {
  const { order = {}, } = useContext(OrderViewContext);
  const user = useSelector((state) => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);
  const reportFiles = useMemo(() => {
    const { performers } = order;
    if (!Array.isArray(performers)) {
      return null;
    }

    return performers.map(el => {
      return {
        title:
          APP !== 'dispatcher'
            ? `Заявка №${order?.clientRequestNr || order?.requestNr}`
            : el?.client?.id === user?.id
              ? `Заявка Подрядчику №${order?.requestNr}`
              : `Заявка от Заказчика №${order?.clientRequestNr || order?.requestNr}`,
        value: (
          <button
            className={`report-file-button ${el?.reportFile ? '' : 'disabled'}`}
            onClick={() => {
              fileOpenInWindow(`${window.API_CONFIGS[APP].host.replace(/\/$/, '') + el?.reportFile?.downloadUrl}`);
            }}
          >
            Просмотреть
          </button>
        ),
        titleClass: 'thin',
        comment: true,
      };
    })
  }, [order])

  const infos = useExecutorsInfo({ order, dictionaries, reportFiles });

  const renderInfo = useMemo(() => {
    if (!infos) {
      return [];
    }
    return infos.map(el => {
      if (Array.isArray(el.data?.info) && el.data?.info?.length) {
        const { title, data } = el;
        return (
          <>
            <div className={'info-title'}>{title}</div>
            <PreparatorsSingle data={data} />
          </>
        )

      }
      return null
    })

  }, [order, infos]);

  if (order?.orderUiState?.state === 102 || !renderInfo.filter(el => el !== null)?.length) {
    return (
      <WhiteBox style={{ 'width': '100%' }} className={'order-view__tab'}>
        <VzEmpty className={'margin-top-100'} vzImageName={'emptyDocuments'} title={'Исполнение'} />
      </WhiteBox>
    )
  }

  return (
    <div className="order-general order-view__container-shadow  flexbox order-view__tab">
      {renderInfo}
    </div>
  )
}

export default OrderViewExecutors;
