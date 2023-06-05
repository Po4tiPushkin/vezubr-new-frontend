import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Static from '@vezubr/common/constants/static';
import { IconDeprecated, FilterButton } from '@vezubr/elements';
import InputField from '../../inputField/inputField';
import AdditionalFilters from '../../orders/additionalFilters/additionalFilters';
import t from '@vezubr/common/localization';
import SavedFilters from '../saved/savedFilters';
import { Utils } from '@vezubr/common/common';
import {
  DROPDOWNPERIOD,
  DROPDOWNPERIOD_PRODUCER_ORDERS,
  RATINGS,
  EMPLOYEE_SYSTEM_STATES,
  DROPDOWNPERIOD_OPERATOR_ORDERS,
  ORDER_TYPE_STATES,
} from '@vezubr/common/constants/constants';
import autobind from 'autobind-decorator';
import moment from 'moment';
import { ButtonAttachDownload } from '../../actions';

class OrdersFiltersSection extends Component {
  constructor(props) {
    super(props);
    const filterTypes = Static.getFilterTypes(props.type);
    let filterValues = {};
    for (let key of Object.keys(filterTypes)) {
      filterValues[key] = '';
    }
    this.state = {
      initialButtons: ['additionalFilters', 'moreActions'],
      filterTypes,
      filterValues,
      showFilterModal: false,
      showSavedModal: false,
      query: {
        period: 1,
      },
      menuOptions: {
        show: false,
        arrowPosition: 'right',
        list: [
          {
            title: t.buttons('print'),
            icon: <IconDeprecated name={'printOrange'} />,
            onAction: () => {},
          },
          {
            title: t.buttons('columns'),
            icon: <IconDeprecated name={'settingsOrange'} />,
            onAction: () => {},
          },
          {
            title: t.buttons('toExcel'),
            icon: <IconDeprecated name={'excelOrange'} />,
            onAction: () => {
              if (this.props.exportToExcelFunc) {
                this.props.exportToExcelFunc();
              }
            },
          },
        ],
      },
      errors: {},
      ...props,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.filtersKeys.length !== nextProps.filters.length) {
      this.setState({ showSaveAction: true });
    }
    if (this.state.filtersKeys.length === nextProps.filters.length) {
      this.setState({ showSaveAction: false });
    }
  }

  async componentDidMount() {
    const { filterTypes } = this.state;
    const { filtersKeys, periodFilter } = this.props;
    const initialFilters = filtersKeys.map((filter) => filterTypes[filter]);
    this.setState({ filters: initialFilters });

    this.props.actions.setFilters(initialFilters);

    if (periodFilter) {
      this.onDropDownChange({ key: '3', val: t.order('filters.forWeek') }, initialFilters[0]);
    }
  }

  getButtons() {
    const { menuOptions } = this.state;
    const { onAddCartulary } = this.props;
    return {
      addVehicle: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/transport'),
        content: <p className={'no-margin'}>{t.buttons('addVehicle')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addTruck: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/trailer'),
        content: <p className={'no-margin'}>{t.buttons('addTruck')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addWagon: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/wagon'),
        content: <p className={'no-margin'}>{t.buttons('addTruck')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addTractor: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/tractor'),
        content: <p className={'no-margin'}>{t.buttons('addTractor')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addTractorNewApi: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/tractors/create'),
        content: <p className={'no-margin'}>{t.buttons('addTractor')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addTrailer: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/trailer'),
        content: <p className={'no-margin'}>{t.buttons('addTrailer')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addTrailerNewApi: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/trailers/create'),
        content: <p className={'no-margin'}>{t.buttons('addTrailer')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addDriver: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/driver'),
        content: <p className={'no-margin'}>{t.buttons('addDriver')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      addLoader: {
        icon: 'plusWhite',
        onClick: () => this.props.history.push('/new-order/loader'),
        content: <p className={'no-margin'}>{t.buttons('addLoader')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
        theme: 'primary',
      },
      actBill: {
        onClick: () => void 0,
        content: <p className={'no-margin'}>{t.registries('act')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
      },
      documents: {
        isAction: true,
        component: ButtonAttachDownload,
      },
      actInvoice: {
        onClick: () => void 0,
        content: <p className={'no-margin'}>{t.registries('invoice')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
      },
      additionalFilters: {
        icon: 'plusBlue',
        onClick: () => this.toggleModal('showFilterModal'),
        content: <p className={'no-margin'}>{t.buttons('additionalFilters')}</p>,
        className: 'rounded box-shadow margin-right-12',
        withMenu: false,
      },
      toExcel: {
        icon: 'excelBlue',
        onClick: () => void 0,
        content: <p className={'no-margin'}>{t.buttons('toExcel')}</p>,
        className: 'rounded box-shadow',
        withMenu: false,
      },
      drafted: {
        icon: 'copyBlue',
        onClick: () => this.toggleModal('showSavedModal'),
        content: <p className={'no-margin'}>{t.buttons('saved')}</p>,
        className: 'rounded box-shadow',
        withMenu: false,
      },
      addCartulary: {
        onClick: () => onAddCartulary(),
        content: (
          <p className={'no-margin'}>
            <IconDeprecated name={'arbeitenBlue'} /> {t.buttons('addCartulary')}
          </p>
        ),
        className: 'rounded box-shadow',
        withMenu: false,
      },
      moreActions: {
        icon: 'dotsBlue',
        onClick: () => this.showDropDown(),
        withMenu: true,
        menuOptions,
        className: 'circle box-shadow margin-left-12',
      },
    };
  }

  onDropDownChange(e, value) {
    if (!e) return;
    const { type } = value;
    const { val, key } = e;

    const query = { ...this.state.query };
    let filterValues = { ...this.state.filterValues };

    if (value.type === 'period') {
      Object.assign(query, this.setPeriodValues(e));
      Object.assign(filterValues, this.setPeriodValues(e));
    }

    if (key === 0) {
      filterValues[type] = '';
      delete query[type];
    } else {
      filterValues[type] = val;
      query[type] = val?.values || Number(key);
    }

    delete query.period;
    this.setState({ filterValues, query });
    this.props.onDropDownChange(filterValues, query);
  }

  onInputChange(e, type) {
    const { filters } = this.props;
    const { errors } = this.state;
    const filter = filters.find((f) => f.type === type);
    let filterValues = { ...this.state.filterValues };
    let query = { ...this.state.query };
    if (e.target || moment.isMoment(e)) {
      let value = moment.isMoment(e) ? e.format('DD.MM.YYYY') : e.target.value;
      filterValues[type] = value;
      if (type && type.includes('Date')) {
        const formatted = Utils.customDateFormatter(value, 'YYYY-MM-DD');
        query[type] = formatted || '';
        errors[type] = !formatted && value ? t.error('error') : false;
      } else {
        query[type] = Number(value) ? Number(value) : value;
      }
    } else {
      const fromOrTill = type.includes('From') ? 'от' : 'до';
      let value;
      if (type && type.includes('Date')) {
        filterValues[type] = e;
        /*value = `${fromOrTill} ${Utils.reformatStringDate(e)}`;
				filterValues[type] = Utils.formatDate(e);*/
      } else {
        value = e.target.value;
        filterValues[type] = value;
      }
      this.setState({ query });
      return this.props.onLocalSearch(filterValues, query);
    }
    this.setState({ filterValues, query });
    this.props.onInputChange(filterValues, query);
  }

  getDropDownData(filter) {
    const { dictionaries, customFilters } = this.props;

    let data = {};
    if (Object.keys(dictionaries).length) {
      if (filter.type === 'period') {
        data = this.setPeriodDropDown();
      } else if (filter.type.toLowerCase().includes('rating')) {
        data = RATINGS;
      } else if (filter.dropDownKey === 'employeeSystemStates') {
        data = EMPLOYEE_SYSTEM_STATES;
      } else if (filter.dropDownKey === 'orderType') {
        data = ORDER_TYPE_STATES;
      } else if (filter.dropDownKey) {
        const isCustom = customFilters ? Object.keys(customFilters).find((f) => f === filter.dropDownKey) : null;
        if (isCustom) {
          data = Object.assign({}, customFilters[filter.dropDownKey]);
        } else {
          data = Object.assign({}, dictionaries[filter.dropDownKey]);
        }
      }
    }
    Object.assign(data, { '0': 'Все' });
    return data;
  }

  setPeriodDropDown(type = this.props.type) {
    let data = null;
    switch (type) {
      case 'producerOrders':
      case 'documents':
      case 'registries':
        data = DROPDOWNPERIOD_PRODUCER_ORDERS;
        break;
      case 'operatorOrders':
        data = DROPDOWNPERIOD_OPERATOR_ORDERS;
        break;
      default:
        data = DROPDOWNPERIOD;

    }
    return data;
  }

  setPeriodValues(period) {
    const { type } = this.props;
    const datePickers = this.props.filters.filter((e) => e.period);
    if (!datePickers || datePickers.length < 2) {
      return {};
    }
    const query = {};
    switch (period.key) {
      case '0':
        query[datePickers[0].type] = undefined;
        query[datePickers[1].type] = undefined;
        break;
      case '1':
        query[datePickers[0].type] = moment().format('DD.MM.YYYY');
        query[datePickers[1].type] = undefined;
        break;
      case '2':
        /*if(type === 'producerOrders') {
					query[datePickers[0].type] = moment().subtract(1, 'days').format('YYYY-MM-DD');
				} else {
					query[datePickers[0].type] = moment().format('YYYY-MM-DD');
				}*/
        query[datePickers[0].type] = moment().subtract(1, 'days').format('DD.MM.YYYY');
        query[datePickers[1].type] = moment().subtract(1, 'days').format('DD.MM.YYYY');
        break;
      case '3':
        query[datePickers[0].type] = moment().subtract(7, 'days').format('DD.MM.YYYY');
        query[datePickers[1].type] = undefined;
        break;
      case '4':
        query[datePickers[0].type] = moment().subtract(1, 'month').format('DD.MM.YYYY');
        query[datePickers[1].type] = undefined;
        break;
      case '5':
        query[datePickers[0].type] = moment().subtract(1, 'year').format('DD.MM.YYYY');
        query[datePickers[1].type] = undefined;
        break;
      default:
        query[datePickers[0].type] = undefined;
        query[datePickers[1].type] = undefined;
        break;
    }
    return query;
  }

  @autobind
  showDropDown() {
    const menuOptions = {
      ...this.state.menuOptions,
      show: !this.state.menuOptions.show,
    };

    this.setState({ menuOptions });
  }

  @autobind
  onFiltersSave() {
    this.setState({ showSaveAction: false });
  }

  @autobind
  onFiltersReset() {
    this.props.actions.setFilters(Array.from(this.state.filters));
    this.setState({ showSaveAction: false });
  }
  @autobind
  goBack() {
    if (this.props.type === 'registryDetail') {
      this.props.history.push('/registries');
    } else {
      this.props.history.push('/monitor/selection');
    }
  }

  @autobind
  toggleModal(type) {
    this.setState({ [type]: !this.state[type] });
  }

  renderButtonSection() {
    let { includedButtons, initialButtons } = this.state;
    const { buttonActions } = this.props;
    const buttons = this.getButtons();
    buttons ? _.intersection(Object.keys(buttons), includedButtons) : void 0;
    const finalButtons =
      includedButtons && buttons ? _.intersection(Object.keys(buttons), includedButtons) : initialButtons;
    return (
      buttons && (
        <div className="flexbox size-0_6 justify-right">
          {finalButtons.map((btnName, key) => {
            const button = buttons[btnName];

            if (button.isAction) {
              if (buttonActions[btnName] && button.component) {
                const ActionComponent = button.component;
                return <ActionComponent {...buttonActions[btnName]} />;
              }

              return null;
            }

            return (
              <FilterButton
                key={key}
                icon={button.icon}
                onClick={button.onClick}
                content={button.content}
                withMenu={button.withMenu}
                theme={button.theme || 'default'}
                menuOptions={button.menuOptions ? button.menuOptions : null}
                className={button.className}
              />
            );
          })}
        </div>
      )
    );
  }

  renderActionSection = () => {
    const { filters, title } = this.props;
    const { filterValues, excluded, errors } = this.state;

    const filtersList = Array.from(filters).filter((filter) => {
      return excluded.some((e) => e === filter.type);
    });
    return (
      <div className={'flexbox align-center margin-top-16'}>
        <div className={'flexbox center margin-right-12'}>
          <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={this.goBack} />
          <h2 className={'big-title title-bold margin-left-12'}> {title}</h2>
        </div>
        <div className="flexbox size-0_5">
          {filtersList.map((filter, key) => {
            const allowManual = filter.type !== 'period';
            return (
              <InputField
                dropDown={
                  filter.dropDown
                    ? {
                        onChange: (e) => this.onDropDownChange(e, filter),
                        data: this.getDropDownData(filter),
                      }
                    : false
                }
                key={key}
                name={filter.type}
                withBorder={true}
                type={'text'}
                datePicker={filter.datePicker}
                placeholder={filter.placeholder}
                size={'small'}
                minDate={false}
                error={errors[filter.type]}
                showErrorInfo={false}
                mask={allowManual ? '99.99.9999' : false}
                allowManual={allowManual}
                value={filterValues[filter.type]}
                className={'margin-right-8'}
                onChange={(e) => this.onInputChange(e, filter.type)}
              />
            );
          })}
        </div>
        {this.renderButtonSection()}
      </div>
    );
  };

  renderInput = (filter, combined) => {
    const { filterValues } = this.state;
    if (combined) filter = combined;
    return (
      <InputField
        dropDown={
          filter.dropDown
            ? {
                onChange: (e) => this.onDropDownChange(e, filter),
                data: this.getDropDownData(filter),
              }
            : false
        }
        withIcon={filter.icon ? <IconDeprecated name={filter.icon} /> : null}
        datePicker={filter.datePicker}
        withBorder={true}
        placeholder={filter.placeholder}
        type={'text'}
        style={filter.style || {}}
        size={'small'}
        value={
          filter.type === 'vehicleType' || filter.type.includes('orderStage')
            ? filterValues[filter.type]?.name
            : filterValues[filter.type]
        }
        name={filter.type}
        className={'margin-right-8 margin-left-8'}
        onChange={(e) => this.onInputChange(e, filter.type)}
      />
    );
  };

  renderFilterSection = () => {
    const { excluded } = this.state;
    const { filters } = this.props;
    const filteredList = Array.from(filters).filter((filter) => !excluded.some((e) => e === filter.type));
    const filteredLists = filteredList.map((filter, index) => {
      return (
        <div className={'flexbox center margin-bottom-8 padding-left-10 padding-right-5'} key={index}>
          {filter.label ? (
            <label className={'text-middle no-margin narrow filter-label'}>{filter.label.toUpperCase()}</label>
          ) : null}
          {this.renderInput(filter)}
          {filter.combinedWith ? this.renderInput(filter, filter.combinedWith) : null}
        </div>
      );
    });
    return (
      <div className={'flexbox margin-bottom-8 wrap'}>
        {filteredLists}
        {this.renderSaveFilters()}
      </div>
    );
  };

  @autobind
  renderSaveFilters() {
    if (this.state.showSaveAction) {
      return (
        <div className={'save-filters'}>
          <span className={'save-filter-button'} onClick={this.onFiltersSave}>
            {t.buttons('saveFilters')}
          </span>
          <span className={'reset-filter-button'} onClick={this.onFiltersReset}>
            {t.buttons('reset')}
          </span>
        </div>
      );
    }
  }

  render() {
    const { actions, user, type, showFilterModal, showSavedModal, filtersKeys, filters } = this.state;
    return (
      <div className={'orders-filter-section'}>
        {this.renderActionSection()}
        <hr />
        {this.renderFilterSection()}
        <AdditionalFilters
          type={type}
          filters={filters}
          user={user}
          actions={actions}
          showModal={showFilterModal}
          resetState={filtersKeys}
          onClose={() => this.toggleModal('showFilterModal')}
        />
        <SavedFilters showModal={showSavedModal} onClose={() => this.toggleModal('showSavedModal')} />
      </div>
    );
  }
}

OrdersFiltersSection.propTypes = {
  filtersKeys: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  excluded: PropTypes.array.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onDropDownChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  excludedButtons: PropTypes.array,
  includedButtons: PropTypes.array,
  customFilters: PropTypes.object,
  buttonActions: PropTypes.object,
  exportToExcelFunc: PropTypes.func,
};

export default OrdersFiltersSection;
