import React from 'react';
import * as cryptoPro from 'crypto-pro'
import { Ant, showAlert, showError } from '@vezubr/elements';
import mockData from './test.json'
// import testTitle from './testTitle.xml'

const testDoc = {
  id: '01d45718-f870-4853-8d84-dd0ca3d1edf3',
  orderId: '24693',
  orderNr: 'R*-*/VZ02/2303-00207/01',
  requestNr: '*/VZ02/2303-00207',
  clientOrderNr: 'R-Z-03/000412/01',
  clientRequestNr: 'Z-03/000412',
  isWithoutDocFlow: true,
  state: 'signing',
  type: 'attorney_for_driver',
  createdAt: '2023-03-31T06:53:10+00:00',
  signatureState: null,
  startDate: '2023-03-31T12:15:00+00:00',
  file: {
    name: '6b71ee9e-57f2-40fa-a1b5-bfcd30c8c907.docx',
    downloadUrl: '/v1/api/download-file/119611?accessKey=bbe235d2-6b69-429a-baf8-b2682ab906f8',
    fileHash: '20cdab95',
    id: 119611,
    originalName: 'doc_01d45718-f870-4853-8d84-dd0ca3d1edf3.docx',
    imageFilesPreviewModel: [
      {
        downloadUrl: null,
        heightInPx: 248,
        widthInPx: 328,
        id: 119611,
      },
      {
        downloadUrl: null,
        heightInPx: 52,
        widthInPx: 52,
        id: 119611,
      },
      {
        downloadUrl: null,
        heightInPx: 176,
        widthInPx: 176,
        id: 119611,
      },
      {
        downloadUrl: null,
        heightInPx: 84,
        widthInPx: 84,
        id: 119611,
      },
      {
        downloadUrl: null,
        heightInPx: 152,
        widthInPx: 152,
        id: 119611,
      },
    ],
  },
  pdfFile: null,
};

function CryptoPro() {
  const [loading, setLoading] = React.useState(false)
  const [msg, setMsg] = React.useState('')
  const [xml, setXML] = React.useState('')
  const [certs, setCerts] = React.useState([])
  const [selectedCert, setSelectedCert] = React.useState('')
  
  // console.log(testTitle)

  const fetchSystemInfo = async () => {
    try {
      setLoading('Проверка плагинов и ПО "Крипто ПРО"')
      console.log(await cryptoPro.getSystemInfo())
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchCertificates = async () => {
    try {
      setLoading('Поиск сертификатов на устройстве')
      const certs = await cryptoPro.getUserCertificates();
      if (certs.length > 0) {
        setCerts(certs)
      } else {
        console.log('Сертификаты не найдены')
        setCerts(mockData)
      }
      setLoading(false)
    } catch (e) {
      console.error(e)
      setCerts(mockData)
      showAlert({
        title: 'Не были найдены сертификаты'
      })
    }
  }

  React.useEffect(() => {
    fetchSystemInfo();
    fetchCertificates();
  }, [])

  const createSignatureFromMsg = async () => {
    try {
      const sign = await cryptoPro.createAttachedSignature(selectedCert, msg) 
      console.log(sign)
    } catch (e) {
      console.error(e)
      showError(e)
    }
  }

  const createSignatureFromXML = async () => {
    try {
      const sign = await cryptoPro.createXMLSignature(selectedCert, xml) 
      console.log(sign)
    } catch (e) {
      console.error(e)
      showError(e)
    }
  }
  return (
    <div style={{backgroundColor: '#fff', width: '100%', height: '100%'}}>
        <label htmlFor="select-cert">Выберите сертификат</label>
      <Ant.Select id='select-cert' onSelect={setSelectedCert} style={{minWidth: 200}}>
        {
          certs.map(item => (
            <Ant.Select.Option value={item.thumbprint} key={item.thumbprint}>
              {item.name}
            </Ant.Select.Option>
          ))
        }
      </Ant.Select>
      <div className="">
        <label htmlFor="message-area">Введите сообщение</label>
        <Ant.Input.TextArea autoSize={true} onChange={(e) => setMsg(e.target.value)} id={'message-area'} />
      </div>
      <div className="">
        <label htmlFor="xml-area">Введите XML структуру документа</label>
        <Ant.Input.TextArea autoSize={true} onChange={(e) => setXML(e.target.value)} id={'xml-area'} />
      </div>

      <div className="actions" style={{marginTop: 30}}>
        <Ant.Button onClick={createSignatureFromMsg}>Сформировать подпись из сообщения</Ant.Button>
        <Ant.Button className={'margin-left-15'} onClick={createSignatureFromXML}>Сформировать подпись изи XML</Ant.Button>
      </div>
    </div>
  )
}

export default CryptoPro