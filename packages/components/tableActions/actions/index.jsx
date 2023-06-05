import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/contour';
import React from 'react';
import ApproveList from './counterparties/approveList';
import Block from './counterparties/block';
import SwitchToAnotherLK from './counterparties/switchToAnotherLK';
import DownloadFile from './documents/downloadFile';
import PreviewFile from './documents/previewFile';
import Sign from './documents/sign';
import ReloadDummy from './dummy/reload';
import AssignRequest from './requests/assign';
import CommentRequest from './requests/comment';
import ReplaceImplementer from './requests/replaceImplementer';
import RepublishRequest from './requests/republish';
import SelectCancellationReason from './requests/selectCancellationReason';
import TakeRequest from './requests/take';

const Counterparties = ({ record, countersHash, dictionaries, reload }) => {
  const contoursApprove = (() => {
    let result = [];
    for (const contour of record.contours) {
      const { status, contour: contourId } = contour;

      if (!countersHash?.[contourId] || contourId === CONTOUR_MAIN_ID) {
        continue;
      }

      if (status === 1) {
        result.push(contour);
      }
    }

    return result;
  })();

  let result = [];
  if (contoursApprove.length) {
    result.push(
      <ApproveList
        contours={record.contours}
        contoursApprove={contoursApprove}
        contractorId={record.id}
        record={record}
        onUpdated={reload}
        countersHash={countersHash}
        dictionaries={dictionaries}
      />,
    );
  }
  if (record.switchAllowed) {
    result.push(<SwitchToAnotherLK lkId={record.id} />);
  }
  if ([2, 4].includes(record?.contours?.[0]?.status) && record?.contours?.[0]?.managerContractorId !== record.id) {
    result.push(<Block record={record} reload={reload}></Block>);
  }
  return result;
}

const Requests = ({ record, reload, user, extra }) => {
  let result = [];
  if (record.status !== 'canceled' && extra?.listType !== 'all' && APP !== 'client') {
    if (record.status !== 'accepted' && APP === 'dispatcher') {
      result.push(<RepublishRequest record={record} reload={reload} />)
    }
    if (!record.vehicleNumber) {
      result.push(<AssignRequest record={record} reload={reload} />)
    }
  }
  result.push(<CommentRequest record={record} reload={reload} />)
  if (['declined', 'canceled'].includes(record.status)) {
    result.push(<SelectCancellationReason record={record} reload={reload} extra={extra} />)
  }
  
  return result;
}

const Documents = ({ record, reload, user, extra }) => {
  let result = [];
  if (record.file && record.file.downloadUrl) {
    result.push(<DownloadFile record={record} reload={reload} />)
  }
  if (record.pdfFile && record.pdfFile.downloadUrl) {
    result.push(<PreviewFile record={record} reload={reload} />)
  }
  if (record.state === 'signing' && record.signatureState === 'sign_required') {
    result.push(<Sign record={record} reload={reload} />)
  }

  return result;
}

export default { Counterparties, Requests, Documents } 