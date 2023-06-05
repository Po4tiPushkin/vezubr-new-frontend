import React, { useCallback, useEffect, useState } from 'react';
import { DocViewer } from '@vezubr/uploader';
import GenerateDocsForm from '../generate-docs-form';
import { showAlert, showError, VzForm } from '@vezubr/elements';
import { Registries } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';
import ImportDocuments from '../import-documents-for-payment';
import centrifugo from '@vezubr/services/socket/centrifuge';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

export default function DocsUploadViewer(props) {
  const { editable, docs, uploadDoc, accepted } = props;
  const vezubrRequiredDocs = ['actDetails1cExportFile', 'actDetailsExcelFile', 'actDetailsPdfFile', 'actExcelFile', 'actPdfFile'];
  const producerRequiredDocs = ['producerActFile', 'producerInvoiceFile'];
  const labels = {
    actDetails1cExportFile: 'Акт выполненных работ в формате для 1С',
    actDetailsExcelFile: 'Акт выполненных работ в формате Excel',
    actDetailsPdfFile: 'Акт выполненных работ в формате PDF',
    actExcelFile: 'Акт выполненных работ(краткая форма) в формате Excel',
    actPdfFile: 'Акт выполненных работ(краткая форма) в формате PDF',
  }
  const defaultProducerDocs = [
    {
      name: 'Акт выполненных работ',
      key: 'producerActFile',
      type: 1
    },
    {
      name: 'Счет фактура',
      key: 'producerInvoiceFile',
      type: 2
    }
  ];
  const [loadingData, setLoadingData] = useState(false);
  const [params, pushParams] = useParams({ history, location });
  const [registry, setRegistry] = useState(null);
  const registryId = docs.id;

  const getConfigurationDocs = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors !== null) {
        return;
      }

      const documentDate = values?.documentDate;

      const data = {
        number: values?.documentNumber,
        date: documentDate && documentDate.format('YYYY-MM-DD'),
      }

      try {
        await Registries.appointNumber({id: registryId, data});
        showAlert({
          title: '',
          content: 'Запрос на формирование документов был отправлен, ожидайте push-уведомления или перезагрузки страницы'
        })
      } catch (e) {
        showError(e);
      }


    },
    [docs],
  );

  const queryNewRegistry = async () => {
    setLoadingData(true);
    try {
      const response = await Registries.getRegistriesDetails(registryId);

      setRegistry(response?.data?.registry || null);
    } catch (e) {
      console.error(e);
    }
    setLoadingData(false);
  };

  const filtrationDocs = (items = {}, requiredDocuments = []) => {
    return Object.entries(items).filter(([key, value]) => {
      for (let i = 0; i < requiredDocuments.length; i++) {
        if ((key === requiredDocuments[i]) && (items[key]?.fileHash)) {
          return true;
        }
      }
    });
  }

  const formattedProducerDocs = (items) => {
    return filtrationDocs(items, producerRequiredDocs).map(([key, doc], i) => {
      const fileNameArr = doc?.originalName.split(".")
      return {
        ...defaultProducerDocs[i],
        fileType: fileNameArr ? fileNameArr[fileNameArr.length - 1] : null,
        fileId: doc?.id,
        fileNameOrigin: doc?.originalName,
        download: doc?.originalName.includes('xml') ? doc?.downloadUrl + '&disposition=attachment' : doc?.downloadUrl,
      }
    });
  };

  const formattedDocs = (items) => {
    if (items) {
      return filtrationDocs(items, vezubrRequiredDocs).map(([key, doc]) => {
        const fileNameArr = doc?.originalName.split(".")
        return {
          key,
          fileType: fileNameArr ? fileNameArr[fileNameArr.length - 1] : null,
          fileId: doc?.id,
          fileLabel: doc?.originalName,
          fileNameOrigin: labels[key],
          download: doc?.originalName.includes('xml') ? doc?.downloadUrl + '&disposition=attachment' : doc?.downloadUrl,
        }
      });
    }
  }

  const listDocs = formattedDocs(docs).map((doc, key) => (
    <div className={'order-accounting-documents__doc'}>
      <DocViewer
        label={doc.fileLabel}
        fileData={doc}
        editable={false}
        key={doc?.fileHash}
        viewButtonDownload={true}
      />
    </div>
  ));

  const configuratedDocs = (() => {
    if (registry) {
      return formattedDocs(registry).map((doc, key) => (
        <div className={'order-accounting-documents__doc'}>
          <DocViewer
            fileData={doc}
            editable={false}
            key={doc?.fileHash}
            viewButtonDownload={true}
          />
        </div>
      ));
    }
  })();

  React.useEffect(() => {
    const sub = centrifugo().joinUser(({data: { data }}) => {
      if (data?.message?.includes('реестра')) {
        window.location.reload();
      }
    })
    return () => {
      sub.leave();
    }
  }, [])

  return (
    <>
      <div className={'order-accounting-documents__row'}>
        <div className={'order-accounting-documents__title'}><b>Предварительный Акт и Реестр для подтверждения нумерацией Vezubr</b></div>
        {listDocs}
      </div>
      {editable ? (
        <>
          <div className={'order-accounting-documents__row'}>
            <GenerateDocsForm accepted={accepted} onSave={getConfigurationDocs} />
          </div>
        </>
      ) : null}
      <div className={'order-accounting-documents__row'}>
        <div className={'order-accounting-documents__title'}><b>Акт и Реестр с необходимой Нумерацией</b></div>
        {configuratedDocs}
      </div>
    
      {/* {editable ? (
        <div className={'order-accounting-documents__row'}>
          <div className={'order-accounting-documents__title'}><b>Импорт документов для оплаты услуг</b></div>
          <ImportDocuments accepted={accepted} editable={editable} docs={docs}/>
        </div>
      ) : (
        <div className={'order-accounting-documents__row'}>
          <div className={'order-accounting-documents__title'}><b>Документы для оплаты услуг</b></div>
          <ImportDocuments accepted={accepted} editable={editable} docs={docs}/>
        </div>
      )} */}
    </>
  )
}