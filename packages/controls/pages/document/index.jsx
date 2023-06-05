import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Documents as DocumentsService } from "@vezubr/services";
import { useSelector } from "react-redux";
import t from "@vezubr/common/localization";
import { IconDeprecated } from "@vezubr/elements";
import { OrderSidebarInfos } from "@vezubr/components";
import { DocumentsViewerUploader } from "@vezubr/order/form";
import useFormatterDocuments from "./hooks/useFormatterDocuments";
import { Ant, VzForm, Loader } from '@vezubr/elements';
import useInfo from './hooks/useInfo';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
const Document = (props) => {
  const { selected } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const history = useHistory();
  const [orderData, setOrderData] = useState(null);
  const { documentTypes, orderDocumentCategories } = dictionaries;
  const getDocuments = useCallback(async () => {
    try {
      const response = await DocumentsService.info(selected.orderId);
      setOrderData(response);
    } catch (e) {
      console.error(e);
    }
  })

  useEffect(() => {
    getDocuments();
  }, [selected]);

  const infos = useInfo({ dictionaries, selected, orderData });

  const renderInfos = useMemo(() => {
    return infos.map((row, index) => {
      return (
        <VzForm.Row key={index} className={'document-row'}>
          {
            row.map((item, index) => {
              return (
                <VzForm.Col span={item.span} key={index}>
                  <div className={`document-wrapper ${item.wrapperClasses}`}>
                    <span className='document-label'>
                      {item.title}
                    </span>
                    {
                      item.type === 'select'
                        ?
                        <Ant.Select
                          defaultValue={item.value}
                          disabled={true}
                          title={item.value}
                        >
                          <Ant.Select.Option value={item.value}>
                            {item.value}
                          </Ant.Select.Option>
                        </Ant.Select>
                        :
                        <Ant.Input
                          value={item.value}
                          disabled={true}
                          title={item.value}
                        />
                    }

                  </div>
                </VzForm.Col>
              )
            })
          }
        </VzForm.Row>
      )
    })
  }, [infos])

  const formattedDocuments = useFormatterDocuments(orderData?.orderDocuments);

  const documentCategories = [...documentTypes, ...orderDocumentCategories];

  const navigateToDocuments = useCallback(() => {
    history.push(`/orders/${selected.orderId}/documents`);
  }, [selected])

  const documentsGroup = [
    {
      title: `Адрес: ${selected.firstAddress}`,
      predicate: () => true
    },
    {
      title: `Адрес: ${selected.lastAddress}`,
      predicate: () => true
    },
  ];

  if (!orderData) {
    return (
      <Loader>Loading...</Loader>
    )
  }

  return (
    <div className={'document-page'}>
      <div className={'document-left'}>
        <div className="connected-order">
          <div className="flexbox">
            <div className="flexbox connected-order-title wrap additional-order-info">
              <div className={'flexbox size-1'}>
                <p
                  style={{ 'cursor': 'pointer', 'color': 'rgb(15, 148, 214)' }}
                  onClick={() => navigateToDocuments()}
                  className={'small-title title-bold'}
                >
                  Рейс № {`${selected?.orderNr} (${selected?.requestNr})`}
                </p>
                <div className={'flexbox justify-right size-1 center'}>
                  <IconDeprecated name={'chevronRightOrange'} onClick={() => navigateToDocuments()} />
                </div>
              </div>
              <hr />
              <div className="document-info">
                {renderInfos}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={'document-right'}>
        <div className="document-documents">Документы к рейсу</div>
        <DocumentsViewerUploader
          showComments={true}
          showAccept={true}
          documentCategories={documentCategories}
          documents={formattedDocuments}
          editable={false}
          groups={documentsGroup}
          visible={true}
          newApi={true}
          reload={getDocuments}
        />
      </div>
    </div>
  )
}

export default Document;