import React, { useMemo, useEffect, useState, useCallback, useContext } from 'react';
import _uniqBy from 'lodash/uniqBy';
import { Documents as DocumentsService, Orders as OrderService } from '@vezubr/services';
import useOrderInfo from './hooks/useOrderInfo';
import { OrderSidebarInfos } from '@vezubr/components';
import OrderGeneralAddress from './components/orderGeneralAddress';
import { useSelector } from 'react-redux';
import { Ant, showError } from '@vezubr/elements';
import Utils from '@vezubr/common/common/utils';
import OrderViewContext from '../../context';
import { useHistory } from 'react-router';
import OrderViewGeneralComment from './components/comment';
const OrderViewGeneral = (props) => {
  const { location } = useHistory();
  const { order = {}, cargoPlace, reload } = useContext(OrderViewContext);
  const { id: orderId } = order;
  const dictionaries = useSelector((state) => state.dictionaries);
  const [requiredDocuments, setRequiredDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = (await DocumentsService.orderDetails({ orderId, type: 'order' })) || [];

      let necessaryDocuments = [];
      response.forEach((item) => {
        if (item.category !== 8010 && item.category !== 8900) {
          necessaryDocuments.push(item);
        }
      });
      // получение массива уникальных документов
      const reqDocuments = _uniqBy(
        necessaryDocuments.map(({ categoryTitle: title }) => ({ title })),
        'title',
      );

      setRequiredDocuments(reqDocuments);
    };

    fetchData();
  }, [order]);

  const orderInfos = useOrderInfo({ order, dictionaries, requiredDocuments });

  const defaultActiveKey = useMemo(() => {
    const activeKey = ['general', 'address', 'parameters'];
    if (location?.search && Utils.queryString(location?.search)?.goTo) {
      activeKey.push(location?.search && Utils.queryString(location?.search)?.goTo)
    }
    return activeKey
  }, [location])
  const renderInfo = useMemo(() => {
    if (!orderInfos) {
      return [];
    }
    return (
      <Ant.Collapse defaultActiveKey={defaultActiveKey}>
        {orderInfos.map((info, index) => {
          if (Array.isArray(info.data) && info.data.length) {
            const { title, data, column, className = '', key, multipleInfos } = info;

            return (
              <Ant.Collapse.Panel
                header={title}
                key={key}
                id={key}
              >
                {
                  multipleInfos ?
                    data.map((el, index) => {
                      const { title, data, } = el;
                      return (
                        <>
                          <div className={'info-title'}>{title}</div>
                          <OrderSidebarInfos
                            key={index}
                            data={data}
                            column={false}
                          />
                        </>
                      )
                    })
                    :
                    <OrderSidebarInfos extraClassName={className} key={index} data={data} column={column} />
                }
              </Ant.Collapse.Panel>
            );
          } else if (info.key === 'address') {
            return (
              <Ant.Collapse.Panel header={info.title} key={info.key}>
                <OrderGeneralAddress
                  order={order}
                  dictionaries={dictionaries}
                  cargoPlace={cargoPlace}
                  reload={reload}
                />
              </Ant.Collapse.Panel>
            );
          }
          return null;
        })}
      </Ant.Collapse>
    );
  }, [order, orderInfos, defaultActiveKey, location]);

  return (
    <div className="order-general order-view__container-shadow flexbox order-view__tab">
      {renderInfo}
    </div>
  );
};

export default OrderViewGeneral;