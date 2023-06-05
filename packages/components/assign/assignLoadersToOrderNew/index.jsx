import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loaders as LoadersService } from '@vezubr/services/index';
import { showError, Modal, Loader as LoaderLoad, Ant } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import Loader from './elements/loader';
import './styles.scss';
const AssignLoadersToOrder = (props) => {
  const {
    showModal,
    onClose,
    assignedLoaders: assignedLoadersInput = [],
    onSelect,
    minLoaders,
    requiredLoaderSpecialities,
  } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const [loaders, setLoaders] = useState([]);
  const [filteredLoaders, setFilteredLoaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [assignedLoaders, setAssignedLoaders] = useState(assignedLoadersInput);

  const fetchLoaders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await LoadersService.list();
      let responseLoadersFiltered = response.loaders || [];
      if (assignedLoaders.length) {
        assignedLoaders.forEach((el) => {
          responseLoadersFiltered = responseLoadersFiltered.filter((item) => el.id !== item.id);
        });
        let assignedLoadersFiltered = assignedLoaders.map(el => {
          el.specialities = response.loaders.find(item => item.id === el.id)?.specialities
          return el
        });
        setAssignedLoaders(assignedLoadersFiltered);
      }
      setLoaders(responseLoadersFiltered);
      setFilteredLoaders(responseLoadersFiltered);
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoaders();
  }, []);

  const onSubmit = useCallback(() => {
    onSelect(assignedLoaders);
  }, [assignedLoaders]);

  useEffect(() => {
    const filterVal = searchValue.toLowerCase();
    const filtered = filterVal
      ? loaders.filter((loader) => {
          const condition = loader.patronymic
            ? loader.name.toLowerCase().includes(filterVal) ||
              loader.surname.toLowerCase().includes(filterVal) ||
              loader.patronymic.toLowerCase().includes(filterVal)
            : loader.name.toLowerCase().includes(filterVal) || loader.surname.toLowerCase().includes(filterVal);

          return condition;
        })
      : loaders;

    setFilteredLoaders(filtered);
  }, [searchValue, loaders]);

  const closeModal = useCallback(() => {
    setSearchValue('');
    onClose();
  }, []);

  const addLoader = useCallback(
    (loader, key) => {
      const newLoaders = loaders.filter((el) => el.id !== loader.id);
      const newAssignedLoaders = [...assignedLoaders, loader];
      setLoaders(newLoaders);
      setAssignedLoaders(newAssignedLoaders);
    },
    [loaders, assignedLoaders],
  );

  const removeLoader = useCallback(
    (loader) => {
      const newAssignedLoaders = assignedLoaders.filter((el) => el.id !== loader.id);
      const newLoaders = [...loaders, loader];

      setLoaders(newLoaders);
      setAssignedLoaders(newAssignedLoaders);
    },
    [loaders, assignedLoaders],
  );

  const renderAssignedLoaders = useMemo(() => {
    return assignedLoaders.map((el, index) => {
      return (
        <Loader
          uiStates={dictionaries?.driverUiStates}
          data={el}
          key={index}
          isBrigadier={index === 0}
          assigned={true}
          onAction={(loader) => removeLoader(loader)}
        />
      );
    });
  }, [assignedLoaders, loaders]);

  const renderLoaders = useMemo(() => {
    return filteredLoaders.map((el, index) => {
      return (
        <Loader
          data={el}
          key={index}
          uiStates={dictionaries?.driverUiStates}
          onAction={(loader) => addLoader(loader)}
        />
      );
    });
  }, [filteredLoaders]);

  const renderSearch = useMemo(() => {
    return (
      <Ant.Input
        suffix={<Ant.Icon type="search" />}
        placeholder="Поиск по ФИО"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    );
  }, [searchValue]);

  const renderModal = useMemo(() => {
    return (
      <div className="assign-loader__main">
        <div className="flexbox">
          <div className="assign-loader__list">
            {renderSearch}
            {renderLoaders}
          </div>
          <div className="assign-loader__assigned">{renderAssignedLoaders}</div>
        </div>
      </div>
    );
  }, [renderAssignedLoaders, renderLoaders]);

  return (
    <Modal
      visible={showModal}
      onCancel={() => closeModal()}
      className={'assign-loader'}
      title={
        <div className="flexbox" style={{ justifyContent: 'space-between' }}>
          {'Добавление специалистов'}
          <div className="assign-loader__count">
            <div className="margin-top-5">Требуемые специалисты:</div>
            {Object.entries(requiredLoaderSpecialities || {}).map(([key, value]) => (
              <div className='text-right text-small'>
                <span >
                  {dictionaries?.loaderSpecialities?.find((item) => item.id == key)?.title + ': ' + value}
                </span>
              </div>
            ))}
            {/* <div>
              <span className='text-small'>
                {
                  Array.isArray(specialists) && specialists.length &&
                  specialists.map(el => el = 'специалист').join(', ')
                }
              </span>

            </div> */}
          </div>
        </div>
      }
      footer={[
        <Ant.Button onClick={() => onSubmit()} key="submit" type="primary" disabled={assignedLoaders?.length < 1}>
          Назначить выбранных
        </Ant.Button>,
      ]}
    >
      {loading ? <LoaderLoad /> : renderModal}
    </Modal>
  );
};

export default AssignLoadersToOrder;
