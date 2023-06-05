import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Ant, showError, VzForm, Loader, showAlert } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import CustomPropertiesForm from "../../../forms/custom-props-form";
import t from "@vezubr/common/localization";
import { useHistory } from 'react-router'

const AdditionalInfo = (props) => {
  const { match, values } = props;
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(values);
  const history = useHistory()

  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       setLoading(true)
  //       const contract = await ContractsService.getContract(match.params.id);
  //       setContract(contract);
  //       setLoading(false)
  //     } catch (e) {
  //       console.error(e);
  //       showError(e);
  //     }
  //   }

  //   fetch();
  // }, [match.params.id]);

  useEffect(() => {
    if (values) {
      setContract({...values})
    }
  }, [values]);

  const onSave = useCallback(
    async (propertyValues) => {
      const payload = {
        ...contract,
        configuration: {
          periodRegisters: {
            type: contract.typeAutomaticRegisters !== 0 ? contract.periodRegisters : 0,
            value: contract.periodRegisters == 0 ? parseInt(contract.manualPeriod) : 0
          },
          typeAutomaticRegisters: contract.typeAutomaticRegisters || 0,
        },
        customProperties:
          propertyValues.filter(el => (Array.isArray(el.values) && el.values.filter(item => item || item === 0).length)),
      };

      delete payload.file;

      try {
        await ContractsService.updateContract({
          id: match.params.id,
          data: payload,
        });
        showAlert({
          content: t.common('Договор был успешно обновлен'),
          onOk: history.push(`/contract/${match.params.id}`),
        });
      } catch (e) {
        console.error(e);
        let mesg = null
        if (e.code === 403) {
          mesg = "У вас нет прав на редактирование договора"
        }
        showError(mesg || e);
      }
    },
    [contract],
  );

  return (
    <>
      {!contract || loading
        ?
        <Loader />
        :
        (
          <>
            <div className="contract__fixed-field">
              <VzForm.Group title={<h2 className="bold">Признак Договора</h2>}>
                <VzForm.Row>
                  <VzForm.Col span={8}>
                    <VzForm.Item disabled={true} label={'Признак Договора'}>
                      <Ant.Input placeholder={''} disabled={true} value={contract?.attribute}/>
                    </VzForm.Item>
                  </VzForm.Col>
                </VzForm.Row>
              </VzForm.Group>
            </div>
            <CustomPropertiesForm
              values={contract?.customProperties || []}
              onSave={onSave}
              entityName={'contract'}
            /> 
          </>
        )
      }
    </>
  )
}

export default AdditionalInfo;