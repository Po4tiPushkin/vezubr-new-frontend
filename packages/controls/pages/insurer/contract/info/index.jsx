import React, { useCallback, useEffect, useState } from 'react';
import { Ant, FilterButton, IconDeprecated, Page, showAlert, showConfirm, showError, VzForm, WhiteBox } from '@vezubr/elements';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import ContractForm from '../../../../forms/insurer/insurer-contract-form';
import t from '@vezubr/common/localization';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { Insurers as InsurersService } from '@vezubr/services';
const InsurerContractInfo = (props) => {
  const { match } = props;
  const history = useHistory();
  const { location } = history
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const onContractEnd = useCallback(async () => {
    try {
      await InsurersService.deactivateContract(contract.id);
      showAlert({ title: 'Договор был успешно деактивирован' })
    } catch (e) {
      console.error(e);
      let mesg = null
      if (e.code === 403) {
        mesg = "У вас нет прав на прекращение договора"
      }
      showError(mesg || e);
    }
  }, [contract])

  const goBack = useGoBack({
    location,
    history,
    defaultUrl: `/insurers/${match.params.id}/contracts`,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await InsurersService.contract(match.params.id);
        setContract({ ...response, maxAmountRestriction: response.maxAmountRestriction / 100, minPremium: response.minPremium / 100 });
      }
      catch (e) {
        showError(e);
        console.error(e);
      }

    }
    fetchData();
  }, [])
  return contract?.insurer ? (
    <div className={'insurer-contract-add'}>
      <div className="insurer-contract__header flexbox align-center space-between">
        <Page.Title
          className={'insurer-contract__title flexbox'}
          onBack={goBack}
        >{`${contract?.insurer.title} / Просмотр договора № ${contract.number}`}</Page.Title>
        <div className="insurer-contraact__button margin-top-16">
          <FilterButton
            icon={'dotsBlue'}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={'circle box-shadow margin-left-12'}
            withMenu={true}
            menuOptions={{
              show: showFilterDropdown,
              arrowPosition: 'right',
              list: [
                {
                  disabled: !contract?.isActive,
                  title: 'Прекратить договор',
                  icon: <IconDeprecated name={'backArrowOrange'} />,
                  onAction: () => {
                    showConfirm({
                      title: `Вы точно хотите деактивировать договор?`,
                      onOk: async () => {
                        onContractEnd();
                      },
                    })
                  }
                },
              ],
            }}
          />
        </div>
      </div>
      <WhiteBox className={'extra-wide margin-top-24 insurer-contract-add__form'}>
        <ContractForm
          disabled={true}
          values={contract}
          loading={loading}
          type={'add'}
          location={location}
          onCancel={goBack}
        />
      </WhiteBox>
    </div>
  ) : null;
};

export default InsurerContractInfo;