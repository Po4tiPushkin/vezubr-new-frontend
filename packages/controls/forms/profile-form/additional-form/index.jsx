import React, { useCallback, useState } from 'react';
import _pick from 'lodash/pick';
import t from '@vezubr/common/localization';
import { Ant, ButtonDeprecated, VzForm, showError } from '@vezubr/elements';
import { fileGetFileData } from '@vezubr/common/utils';
import { DocViewer } from "@vezubr/uploader";
import { Profile as ProfileService } from "@vezubr/services"
import _isEqual from 'lodash/isEqual'

const FIELDS = {
  checkingAccount: 'checkingAccount',
  bik: 'bik',
  correspondentAccount: 'correspondentAccount',
  bankName: 'bankName',
}

export const validators = {
  [FIELDS.bik]: (value) => {
    if (value && value.length !== 9) {
      return 'Значение банка должно состоять из 9 цифр';
    }
  },
  [FIELDS.checkingAccount]: (value) => {
    if (value && value.length !== 20) {
      return 'Количество символов в поле должно быть ровно 20';
    }
  },
};

const AdditionalForm = (props) => {
  const {
    contractor,
    onSave,
    form,
    loading = false,
    onBikChange,
    edited,
    setEdited
  } = props;
  const { getFieldError, getFieldDecorator, setFieldsValue } = form;
  const [logoFileId, setLogoFileId] = useState(null);
  const docType1 = contractor?.documents?.find((doc) => (contractor.type === 2 ? doc.type === 6 : doc.type === 1));
  const docType2 = contractor?.documents?.find((doc) => (contractor.type === 2 ? doc.type === 9 : doc.type === 3));
  const [doc1, setDoc1] = useState(docType1?.files ? docType1.files.find(el => el.actual) : (docType1 || null));
  const [doc2, setDoc2] = useState(docType2?.files ? docType2.files.find(el => el.actual) : (docType2 || null));
  const [logo, setLogo] = useState(contractor?.logo);

  const rules = VzForm.useCreateAsyncRules(validators);

  const photoFile = {
    name: 'Фото профиля',
    key: 'profileAvatar'
  }
  const doc1FileDefault = {
    name: contractor?.type === 2 ? 'Скан паспорта, страница с фотографией' : 'Устав',
    documentType: contractor?.type === 2 ? 6 : 1,
  };
  const doc2FileDefault = {
    name: contractor?.type === 2 ? 'Скан паспорта, страница с регистрацией' : 'Приказ о назначении Директора или доверенность',
    documentType: contractor?.type === 2 ? 9 : 3,
  };

  React.useEffect(() => {
    if (!contractor.correspondentAccount && !contractor.bankName && contractor?.bik?.length == 9) {
      const fetchBankInfo = async () => {
        const bankInfo = await ProfileService.getBankInformation(contractor.bik)
        if (bankInfo && bankInfo.correspondentAccount) {
          await setFieldsValue({
            correspondentAccount: bankInfo.correspondentAccount,
            bankName: bankInfo.name
          })
          setTimeout(() => {
            handleSave()
          }, 500)
        } else {
          showError('Банк с указанным БИК не был найден')
        }
      }
      fetchBankInfo()
    }
  }, [])

  const handleSave = useCallback(
    (e) => {
      e?.preventDefault();
      if (onSave) {
        const files = {
          logoFileId: logo?.fileId || logo?.id || null,
          documents: [
            doc1 && ({
              ...doc1,
              type: doc1FileDefault.documentType
            }),
            doc2 && ({
              ...doc2,
              type: doc2FileDefault.documentType
            })
          ].filter(item => item) || null,
        }
        onSave(form, files);
      }
    },
    [form, onSave, logo, doc1, doc2],
  );

  const doc1FileData = React.useMemo(() => {
    return doc1?.files ? doc1.files[0] : (doc1 || doc1FileDefault)
  }, [doc1, doc1FileDefault])

  const doc2FileData = React.useMemo(() => {
    return doc2?.files ? doc2.files[0] : (doc2 || doc2FileDefault)
  }, [doc2, doc2FileDefault])

  if (!contractor) {
    return null;
  }

  return (
    <div className={'flexbox size-1 column'}>
      <div className={'company-info'}>
        <h2 className={'company-info-title'}>{t.profile('logo/photo')}</h2>
        <DocViewer
          label={photoFile.name}
          fileData={fileGetFileData(logo || photoFile)}
          editable={true}
          onChange={(docSaving) => {
            setLogo(docSaving);
            setEdited(true);
          }}
          onRemove={() => {
            setLogo(null)
            setEdited(true);
          }}
        />
      </div>
      <div className={'company-info'}>
        <h2 className={'company-info-title'}>{t.profile('bankRequisites')}</h2>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('checkingAccount')} error={getFieldError(FIELDS.checkingAccount)}>
              {getFieldDecorator(FIELDS.checkingAccount, {
                rules: rules[FIELDS.checkingAccount](),
                initialValue: contractor?.[FIELDS.checkingAccount] || '',
              })(<Ant.Input placeholder={t.profile('provideCode')} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('bank')} error={getFieldError(FIELDS.bik)}>
              {getFieldDecorator(FIELDS.bik, {
                rules: rules[FIELDS.bik](),
                initialValue: contractor?.[FIELDS.bik] || '',
              })(<Ant.Input placeholder={t.profile('provideCode')} onChange={onBikChange} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('correspondentAccount')} error={getFieldError(FIELDS.correspondentAccount)}>
              {getFieldDecorator(FIELDS.correspondentAccount, {
                initialValue: contractor?.[FIELDS.correspondentAccount] || '',
              })(<Ant.Input disabled={true} placeholder={t.profile('automaticallyFilled')} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('bankName')} error={getFieldError(FIELDS.bankName)}>
              {getFieldDecorator(FIELDS.bankName, {
                initialValue: contractor?.[FIELDS.bankName] || '',
              })(<Ant.Input disabled={true} placeholder={t.profile('automaticallyFilled')} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </div>
      <div className={'flexbox size-1 margin-bottom-48'}>
        <div className={'company-info'}>
          <h2 className={'company-info-title'}>{t.common('documents')}</h2>
          <div className={'flexbox'}>
            {/* 865 - remove columns from felx */}
            <DocViewer
              label={doc1FileData?.name || doc1FileDefault?.name}
              fileData={fileGetFileData(doc1FileData)}
              editable={true}
              className={'size-1'}
              onChange={(docSaving) => {
                setDoc1(docSaving)
                setEdited(true);
              }}
              onRemove={() => {
                setDoc1(null)
                setEdited(true);
              }}
            />
            <DocViewer
              label={doc2?.name || doc2FileDefault?.name}
              fileData={fileGetFileData(doc2FileData)}
              editable={true}
              className={'size-1'}
              onChange={(docSaving) => {
                setDoc2(docSaving)
                setEdited(true);
              }}
              onRemove={() => {
                setDoc2(null)
                setEdited(true);
              }}
            />
          </div>
        </div>
      </div>
      <div className={'bottom-wrapper flexbox justify-right'}>
        <ButtonDeprecated
          theme={'primary'}
          className={'semi-wide'}
          onClick={handleSave}
          loading={loading}
          disabled={!edited}
        >
          {t.common('saveChanges')}
        </ButtonDeprecated>
      </div>
    </div>
  );
};

export default Ant.Form.create({
  onValuesChange: ({ setEdited, values }, changedValues) => {
    setEdited(!_isEqual(changedValues, values));
  },
})(AdditionalForm);
