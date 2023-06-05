import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import { Ant, ButtonDeprecated, FilterButton, Page, showAlert, showError, WhiteBox } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams as useRouterParams } from 'react-router';
import ContractForm from '../form';

const { Divider } = Ant;

const ContractPage = ({ match, dictionaries, user, location }) => {
  const [contract, setContract] = useState(null);
  const [profile, setProfile] = useState();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { id } = useRouterParams();
  const history = useHistory();
  const [reload, setReload] = useState(Date.now());
  const [editable, setEditable] = useState(true);
  const profileId = useMemo(() => {
    if (user.id === contract?.producerId) {
      return contract.clientId;
    }
    if (user.id === contract?.clientId) {
      return contract.producerId;
    }

    return null;
  }, [contract]);
  const backUrl = useMemo(() =>
    history.location.state ? history.location?.state?.back?.pathname : `/counterparty/${profileId}/contracts`, [profileId])
  const isNotMainPage = useMemo(() => {
    const arr = location?.pathname.split('/');
    if (arr[arr.length - 1] === 'margin' || arr[arr.length - 1] === 'additional' || arr[arr.length - 1] === 'agreements') {
      return true;
    }
    return false;
  }, [location]);
  const dict = useConvertDictionaries({ dictionaries });

  const getContract = useCallback(async () => {
    try {
      const response = await ContractsService.getContract(id);
      setEditable(response.createdContractorId === user?.id);
      setContract(response);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [id, user]);


  const onContractEdit = useCallback(() => {
    history.push(`/contract/${id}/edit`);
  }, [history, id]);

  const onContractEnd = useCallback(async () => {
    try {
      await ContractsService.endContract(id);
      await getContract();
    } catch (e) {
      console.error(e);
      let mesg = null;
      if (e.code === 403) {
        mesg = 'У вас нет прав на прекращение договора';
      }
      showError(mesg || e);
    }
  }, [id]);

  useEffect(() => {
    getContract();
  }, [id, user, reload]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileId) {
        try {
          const response = await ContractsService.getProfile(profileId);
          setProfile(response);
        } catch (e) {
          console.error(e);
          showError(e);
        }
      }
    };
    fetchProfile();
  }, [profileId, id]);

  const contractTypes = React.useMemo(
    () => {
      return dictionaries?.contourContractContractTypes?.map(({ id, title }) => {
        return {
          label: title,
          value: id,
        }
      })
    },
    [dictionaries?.contourContractContractTypes],
  );

  const onMarginSave = useCallback(
    async ({ bargain, rate, tariff }) => {
      try {
        const values = _cloneDeep({ bargain, rate, tariff });

        Object.keys(values).forEach((el) => {
          if (Object.keys(values[el])?.length === 0) {
            delete values[el];
          } else {
            Object.keys(values[el]).forEach((item) => {
              if (values[el][item]?.type === 'amount') {
                values[el][item].value *= 100;
              }
            });
          }
        });

        await ContractsService.margin(id, values);
        showAlert({
          content: 'Маржинальность была сохранена',
          onOk: history.push(`/contract/${id}`),
        });
        setReload(Date.now());
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [id],
  );

  if (!contract || !profile) {
    return null;
  }

  return (
    <WhiteBox className={'margin-top-24 contract-card'}>
      <div className="contract-card__header">
        <Page.Title onBack={() => history.push(backUrl)}>
          <span>
            ID: {`${profileId} / ${profile?.name}`} / Карточка договора
          </span>
        </Page.Title>
        <div className="contract-card-filter">
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
                  disabled: !contract?.active,
                  title: 'Договор прекращен',
                  icon: <Ant.Icon name={'backArrowOrange'} />,
                  onAction: () => onContractEnd(),
                },
              ],
            }}
          />
        </div>
      </div>
      <ContractForm
        values={{
          ...contract,
          signedAt: moment(contract.signedAt),
          expiresAt: contract.expiresAt ? moment(contract.expiresAt) : null,
        }}
        onMarginSave={onMarginSave}
        match={match}
        contractTypes={contractTypes}
        disabled={true}
        role={profile?.role}
        notActive={!editable || !contract?.active}
        reload={getContract}
      />
      {!isNotMainPage && (
        <div className="contract-card__buttons">
          <ButtonDeprecated
            className={'semi-wide'}
            theme={'primary'}
            onClick={onContractEdit}
            disabled={!editable || !contract?.active}
          >
            Редактировать
          </ButtonDeprecated>
        </div>
      )}
    </WhiteBox>
  );
};

export default connect((state) => ({
  dictionaries: state.dictionaries,
  user: state.user,
}))(React.memo(ContractPage));
