import { Utils } from '@vezubr/common/common'
import React from 'react'
import RequestTemplate from './templates'

export default function TemplatePreview() {
  const fields = React.useMemo(() => {
    return JSON.parse(localStorage.getItem('templatePreviewFields').replaceAll('"percent"', '%')).filter((item) => item.title !== null)
  }, [])
  return (
    <RequestTemplate fields={fields}/>
  )
}
