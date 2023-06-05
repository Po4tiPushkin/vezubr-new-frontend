import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Ant, showError, VzForm, Loader } from '@vezubr/elements';
import { Contractor as ContractorService, Profile as ProfileService } from '@vezubr/services';
import CustomPropertiesForm from "../../../../forms/custom-props-form";

const AdditionalInfo = (props) => {
  const { id, info, setInfo } = props;
  const [loading, setLoading] = useState(false);

  const onSave = useCallback(async (propertyValues) => {
    const data = {
      customProperties:
        propertyValues.filter(el => (Array.isArray(el.values) && el.values.filter(item => item || item === 0).length)),
      internalResponsibleEmployees: info?.internalResponsibleEmployees.map(el => el.id),
      publicResponsibleEmployees: info?.publicResponsibleEmployees.map(el => el.id),
      comment: info?.comment,
      publicComment: info?.publicComment,
      insurerContractId: info?.insurerContract?.id,
    }
    try {
      setLoading(true);
      const response = await ProfileService.contractorEdit({ id, data });
      setInfo({
        id,
        ...response,
      }
      );
      Ant.message.success({
        content: 'Изменения сохранены',
      });
    } catch (e) {
      showError(e);
      console.error(e);
    }
    finally {
      setLoading(false)
    }

  }, [info])

  return (
    <>
      {!info|| !info?.customProperties || loading
        ?
        <Loader />
        :
        <CustomPropertiesForm
          values={info?.customProperties}
          onSave={onSave}
          entityName={'client'}
        />
      }
    </>
  )
}

export default AdditionalInfo;