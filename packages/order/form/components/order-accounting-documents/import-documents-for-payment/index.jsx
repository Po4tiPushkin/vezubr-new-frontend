import React from 'react';
import { DocViewer } from '@vezubr/uploader';
import { Ant } from '@vezubr/elements';

function ImportDocuments({ onSave, editable, docs, accepted }) {

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(form);
    }
  }

  const [actImportFile, setActImportFile] = React.useState(docs.act)
  const [invoiceImportFile, setInvoiceImportFile] = React.useState(docs.invoice)
  const [invoice1ImportFile, setInvoice1ImportFile] = React.useState(docs.invoice1)

  const disabled = React.useMemo(() => {
    if (typeof accepted === 'boolean') return !accepted
    return false
  }, [accepted]);

  return (
    <div className='flexbox column' style={{width: '100%'}}>
      <div className="flexbox space-between margin-bottom-10">
        <DocViewer 
          label={"Счет-фактура"}
          disabled={disabled}
          className={'order-accounting-documents__import-doc'}
          fileData={actImportFile}
          onChange={(fileData) => {
            setActImportFile(fileData)
          }}
        />
        <DocViewer
          label={"Счет"} 
          disabled={disabled}
          className={'order-accounting-documents__import-doc'}
          fileData={invoiceImportFile}
          onChange={(fileData) => {
            setInvoiceImportFile(fileData)
          }}
        />
        <DocViewer 
          label={"Акт"}
          disabled={disabled}
          className={'order-accounting-documents__import-doc'}
          fileData={invoice1ImportFile}
          onChange={(fileData) => {
            setInvoice1ImportFile(fileData)
          }}
        />
      </div>
      {
        editable ? (
          <div>
            <Ant.Button ghost={disabled} disabled={disabled} type={'primary'}  onClick={handleSubmit} >
              Импортировать документы
            </Ant.Button>
          </div>
        ) : (
          null
        )
      }
    </div>
  )
}

export default ImportDocuments;