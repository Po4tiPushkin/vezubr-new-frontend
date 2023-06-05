import React, { useMemo } from "react"
import moment from "moment";

const formatParser = 'YYYY-MM-DD HH:mm:ss';
const useDefaultParams = () => {
  const defaultParameters = useMemo(() => {
    const monitorDateType = localStorage.getItem('monitorDateType');
    const toStartAtDateFromMonitor = localStorage.getItem('toStartAtDateFromMonitor');
    const toStartAtDateTillMonitor = localStorage.getItem('toStartAtDateTillMonitor');
    if (monitorDateType && (monitorDateType !== '8' && monitorDateType !== '0')) {
      switch (monitorDateType) {
        case '1':
          return {
            "toStartAtDateFrom": moment().startOf('day').format(formatParser),
            "toStartAtDateTill": moment().add(1, 'days').endOf('day').format(formatParser)
          }
        case '4':
          return {
            "toStartAtDateFrom": moment().startOf('day').format(formatParser),
            "toStartAtDateTill": moment().add(7, 'days').endOf('day').format(formatParser)
          }
      }
    }
    else {
      return {
        "toStartAtDateFrom":
          toStartAtDateFromMonitor
            ?
            toStartAtDateFromMonitor === 'null'
              ?
              null
              :
              moment(toStartAtDateFromMonitor).format(formatParser)
            :
            moment().startOf('day').format(formatParser),

        "toStartAtDateTill":
          toStartAtDateTillMonitor
            ?
            toStartAtDateTillMonitor === 'null'
              ?
              null
              :
              moment(toStartAtDateTillMonitor).format(formatParser)
            :
            moment().add(1, 'day').endOf('day').format(formatParser)
      }
    }
  }, [localStorage.getItem('toStartAtDateFromMonitor'), localStorage.getItem('toStartAtDateTillMonitor'), localStorage.getItem('monitorDateType')])

  return defaultParameters

}


export default useDefaultParams;