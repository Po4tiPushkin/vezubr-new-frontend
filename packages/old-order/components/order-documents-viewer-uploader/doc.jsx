import { useContext } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { DocViewer, Multiple } from '@vezubr/uploader';
import { uuid } from '@vezubr/common/utils';
import { CLS_ROOT } from './constant';
import { OrderDocumentViewerUploaderContext } from './context';
import { Ant, Comments, VzForm } from '@vezubr/elements';
import moment from 'moment';
import {Documents as DocumentsService} from "@vezubr/services";

const CLS = `${CLS_ROOT}__doc`;

const Doc = (props) => {
  const { doc, reload } = props;
  const { documentCategories, store } = useContext(OrderDocumentViewerUploaderContext);
  const { category } = doc;
  const { editable, showComments, showAccept, newApi } = store;
  const [writeComment, setWriteComment] = useState('');
  const [isAccept, setIsAccept] = useState(Boolean(doc.originalAcceptedAt));

  const documentName = documentCategories?.find(item => item.id == category)?.title || 'Неизвестный документ';

  const addFiles = useCallback(
    (filesData) => {
      doc.addFiles(filesData);
    },
    [doc],
  );

  const removeFile = useCallback((id) => doc.deleteFile(id), [doc]);

  const updateFile = useCallback((fileData, id) => doc.updatedFile(id, fileData), [doc]);

  const keyAddFile = useMemo(() => uuid(), [doc.files.length]);

  const isDisabledAcceptButton = useMemo(() => {
    return isAccept ? `${CLS_ROOT}__accept-button--disabled` : '';
  }, [isAccept]);

  const handleAddComment = useCallback(
    async () => {
      const commentForStore = {
        text: writeComment,
        date: moment().unix(),
      }

      try {
        await DocumentsService.addComment({
          orderDocumentId: doc.id,
          text: writeComment,
        });
        setWriteComment('');
        if (reload) {
          reload();
        }
      } catch(e) {
        console.error(e);
      }
    },
    [doc, writeComment],
  );

  const handleAcceptDocument = async () => {
    try {
      if (newApi) await DocumentsService.accept({ orderDocumentId: doc.id });
      else await DocumentsService.acceptDocument(doc.id);
      setIsAccept(true);
    } catch(e) {
      console.error(e);
    }
  }

  const onChangeComment = (val) => {
    setWriteComment(val);
  }

  const isDisabledCommentButton = writeComment ? '' : 'disabled';

  return (
    <div className={CLS}>
      <div className={`${CLS}__name`}>{documentName}</div>
      <div className={`${CLS}__files`}>
        <div className={`${CLS}__files__row`}>
          {doc.files.map(([id, file]) => (
            <div key={id} className={`${CLS}__files__row__col`}>
              <DocViewer
                label={documentName}
                key={id}
                fileData={file}
                editable={editable}
                onRemove={() => removeFile(id)}
                onChange={(fileData) => {
                  updateFile(fileData, id);
                }}
              />
            </div>
          ))}

          {editable && doc.canAddFiles && (
            <div className={`${CLS}__files__row__col`}>
              <Multiple key={keyAddFile} label={documentName} onChange={addFiles} />
            </div>
          )}
        </div>
      </div>

      {showComments && (
        <>
          <div className={`${CLS_ROOT}__comment`}>
            <div className={`${CLS_ROOT}__comment-items`}>
              <div className={`${CLS_ROOT}__comment-title`}>Комментарии к документу:</div>
              {doc.comments.length > 0 && <Comments comments={doc.comments} />}
            </div>
            <VzForm.Group className={`${CLS_ROOT}__comment-group`}>
              <VzForm.Row>
                <VzForm.Col span={24} className={`${CLS_ROOT}__comment-form`}>
                  <VzForm.Item label={'Комментарий к документу'}>
                    <Ant.Input
                      name={'comment'}
                      value={writeComment}
                      onChange={(e) => {onChangeComment(e.target.value)}}
                    />
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
            </VzForm.Group>
          </div>
          <div className={`${CLS_ROOT}__accept`}>
            <Ant.Button className={isDisabledCommentButton} type={'primary'} onClick={handleAddComment}>
              Отправить комментарий
            </Ant.Button>
            <Ant.Button className={`${CLS_ROOT}__accept-button ${isDisabledAcceptButton}`} type={'primary'} onClick={handleAcceptDocument}>Принять документ</Ant.Button>
          </div>
        </>
      )}
    </div>
  );
};

Doc.propTypes = {
  doc: PropTypes.object,
  placeholder: PropTypes.string,
};

export default observer(Doc);
