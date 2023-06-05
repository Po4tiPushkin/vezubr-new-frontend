import React, { Component } from 'react';
import Static from '@vezubr/common/constants/static';
import { ORDERS_STAGES } from '@vezubr/common/constants/constants';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TableHead from './head/tableHead';
import TableRow from './row/tableRow';
import autobind from 'autobind-decorator';
import t from '@vezubr/common/localization';
import { IconDeprecated, ButtonDeprecated, Loader } from '@vezubr/elements';
import Pagination from 'react-js-pagination';

const tableWithTotals = [
  'invoices',
  'invoiceDetails',
  'transports',
  'drivers',
  'producerLoader',
  'producerOrders',
  'documents',
  'orders',
  'clients',
  'producer',
  'registryDetails',
  'operatorLoaders',
  'transportsOperator',
  'operatorOrders',
  'operatorDrivers',
  'cartulary',
  'cartularyAdd',
];
const tableWithoutSum = ['transports', 'drivers', 'producerLoader', 'producerOrders', 'documents', 'registryDetails'];
const tableWithFewTotals = ['registryDetails'];

class Table extends Component {
  constructor(props) {
    super(props);
    let dataType = props.user && props.user['function'] ? (props.user['function'] === 1 ? 'pp' : 'pprr') : null;
    this.state = {
      keys: Static.getTableRows(props.type, dataType),
      page: 1,
      canScroll: true,
      inited: false,
    };
  }

  componentWillMount() {}

  @autobind
  initScrollBar() {
    const tableContainer = document.getElementsByClassName('table-container');
    if (tableContainer && tableContainer[0]) {
      tableContainer[0].onscroll = (e) => this.onScroll(e);
    }
  }

  @autobind
  goTo(item) {
    const { history } = this.context;
    const { type } = this.props;
    let url;
    if (type === 'invoices') {
      url = `/${type}/${item.id}`;
    } else if (type === 'orders') {
      url = `/${type}/${item.order_id}`;
      if (item.frontend_client_status) {
        if (ORDERS_STAGES.execution.values.includes(item.frontend_client_status)) {
          url += `/perpetrators`;
        } else if (ORDERS_STAGES.paperCheck.values.includes(item.frontend_client_status)) {
          if (item.problems && item.problems.length && item.problems.find((p) => p && p.type === 9)) {
            url += `/general`;
          } else {
            url += `/documents`;
          }
        } else {
          url += '/map';
        }
      } else {
        url += '/map';
      }
    } else if (type === 'producerOrders' || type === 'operatorOrders') {
      url = `/orders/${item.orderId}/map`;
    } else if (type === 'transports' || type === 'transportsOperator') {
      url = `/profile/transport/${item.id}`;
    } else if (type === 'drivers' || type === 'operatorDrivers') {
      url = `/profile/driver/${item.id}`;
    } else if (type === 'tractors') {
      url = APP === 'dispatcher' ? `/tractors/${item.id}` : `/profile/tractor/${item.id}`;
    } else if (type === 'trailers') {
      url = APP === 'dispatcher' ? `/trailers/${item.id}` : `/profile/trailer/${item.id}`;
    } else if (type === 'documents') {
      return this.props.onClick(item);
    } else if (type === 'producerLoader') {
      url = `/profile/loader/${item.loaderId}`;
    } else if (type === 'producer') {
      url = `/profile/producer/${item.id}`;
    } else if (type === 'clients') {
      url = `/profile/client/${item.id}`;
    } else if (type === 'operatorLoaders') {
      url = `/profile/loader/${item.id}`;
    }
    /*else if(type === 'documents'){
			url = `/orders/${item.orderId}/documents`
		}*/
    return url ? history.push(url) : void 0;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length !== this.state.dataLength || nextProps.data !== this.state.data) {
      this.setState({ dataLength: nextProps.data.length });
    }
    if (nextProps.data.length === this.state.dataLength && this.state.inited) {
      this.setState({ canScroll: false });
    }
    if (nextProps.type !== this.props.type) {
      let dataType =
        this.props.user && this.props.user['function'] ? (this.props.user['function'] === 1 ? 'pp' : 'pprr') : null;
      this.setState({ keys: Static.getTableRows(nextProps.type, dataType) });
    }
  }

  @autobind
  onScroll(e) {
    e.preventDefault();
    let table = document.getElementsByClassName('table-container');
    let headerHeight = document.getElementsByClassName('top-nav')[0];
    headerHeight = headerHeight ? headerHeight.clientHeight : 0;
    if (window.innerHeight + window.scrollY - headerHeight === document.body.offsetHeight) {
      setTimeout(() => {
        if (this.props.onScroll && this.state.canScroll) {
          this.setState({ page: this.state.page + 1, inited: true });
          this.props.onScroll(this.state.page);
        }
      }, 50);
    }
  }

  renderLineText(lines) {
    if (lines === 1) {
      return t.bills('line1');
    } else if (lines > 1 && lines <= 4) {
      return t.bills('line');
    } else if ((lines) => 5 && lines < 20) {
      return t.bills('lines');
    }
    return this.renderLineText(Number(((lines / lines.toString().length) * 10).split('').pop()));
  }

  renderSumFor(forColumn, data) {
    const v = data.reduce((total, current) => +total + +current[forColumn], 0);
    return v ? `${v / 100} руб.` : '';
  }

  renderTable(headers, body) {
    const { emptyState, isLoading } = this.props;
    return (
      <div>
        <table id="table" className={'vz-table'}>
          <thead>
            <tr>{headers}</tr>
          </thead>
          {!isLoading && !emptyState ? (
            <tbody onScroll={this.onScroll} id="tbody" className={'table-body'}>
              {body}
            </tbody>
          ) : null}
        </table>
        {isLoading ? (
          <div className={'full-height flexbox column margin-top-50 margin-bottom-50'}>
            <Loader />
          </div>
        ) : (
          emptyState
        )}
      </div>
    );
  }

  render() {
    const {
      type,
      data,
      dictionaries,
      onDropDownChange,
      handleChange,
      sumProperty,
      sidebarState,
      user,
      emptyState,
      stausAddCartulary,
      onAddCartulary,
      arrIdCartulary,
      addCartulary,
      styles,
      pagination,
      bottomAction,
      bottomDescription,
    } = this.props;
    const { keys } = this.state;
    let dataType = user && user['function'] ? (user['function'] === 1 ? 'pp' : 'pprr') : null;
    const tableHeaders = Static.tableHeaders(type, dataType).map((value, key) => (
      <TableHead key={key} index={key} value={value} setSort={this.props.sortBy} />
    ));

    const tableBody = data.map((value, key) => {
      return (
        <TableRow
          key={key}
          index={key}
          handleChange={handleChange}
          onDropDownChange={onDropDownChange}
          type={type}
          value={value}
          keys={keys}
          dictionaries={dictionaries}
          navigate={() => this.goTo(value)}
          arrIdCartulary={arrIdCartulary}
        />
      );
    });
    const table = this.renderTable(tableHeaders, tableBody);
    this.initScrollBar();
    let pageSum = data.length;
    if (pagination && pagination.total > 100) {
      pageSum = `${pagination.activePage * 100 - 100 + 1} - ${data.length + (pagination.activePage - 1) * 100} из ${
        pagination.total
      }`;
    }
    return (
      <div className={`table-container ${emptyState ? 'is-empty' : ''}`} id={'table-container'} style={styles}>
        {table}
        {tableWithTotals.some((tb) => {
          return type === tb;
        }) ? (
          <div
            className={
              'fixed-footer ' +
              (sidebarState ? 'min-footer ' : 'max-footer ') +
              (tableWithFewTotals.some((tb) => type === tb) ? 'space-between' : '')
            }
          >
            {!stausAddCartulary ? (
              <span className={'row-length'}>
                {pageSum} {this.renderLineText(data.length)}
              </span>
            ) : null}

            {tableWithoutSum.some((tb) => type === tb) ? null : !stausAddCartulary ? (
              <span className={'row-sum'}>{this.renderSumFor(sumProperty, data)}</span>
            ) : null}

            {pagination ? (
              <Pagination
                innerClass={'pagination flexbox size-1 center'}
                activePage={pagination.activePage}
                itemsCountPerPage={pagination.perPage}
                totalItemsCount={pagination.total}
                onChange={pagination.handlePageChange}
              />
            ) : null}

            {bottomAction && (
              <div style={{ marginLeft: 'auto', padding: '0 10px' }}>
                <ButtonDeprecated theme={'primary'} onClick={bottomAction}>
                  {bottomDescription}
                </ButtonDeprecated>
              </div>
            )}

            {tableWithFewTotals.some((tb) => type === tb) ? (
              <div className={'flexbox'}>
                <div className={'margin-right-40'}>
                  {t.registries('totalSum')}
                  <b className={'margin-left-15'}>{this.renderSumFor('cost', data)}</b>
                </div>
                <div className={'margin-right-40'}>
                  {t.registries('totalPO')}
                  <b className={'margin-left-15'}>{this.renderSumFor('softwareFee', data)}</b>
                </div>
                <div className={'margin-right-60'}>
                  {t.registries('totalPodryadchik')}
                  <b className={'margin-left-15'}>{this.renderSumFor('payedSum', data)}</b>
                </div>
              </div>
            ) : null}
            {type === 'cartulary' || type === 'cartularyAdd' ? (
              stausAddCartulary ? (
                <div className={'cartulary_actions'}>
                  {arrIdCartulary.length > 0 ? (
                    <div onClick={addCartulary}>
                      <IconDeprecated name={'arbeitenOrange'} /> Сформировать реестр
                    </div>
                  ) : null}
                  <div onClick={onAddCartulary}>
                    Отмена <IconDeprecated name={'xOrange'} />
                  </div>
                </div>
              ) : (
                <div className={'flexbox'}>
                  <div className={'margin-right-40'}>
                    {t.registries('totalSum')}
                    <b className={'margin-left-15'}>{this.renderSumFor('orderSum', data)}</b>
                  </div>
                  <div className={'margin-right-40'}>
                    {t.registries('totalPO')}
                    <b className={'margin-left-15'}>{this.renderSumFor('orderSoftwareSum', data)}</b>
                  </div>
                  <div className={'margin-right-60'}>
                    {t.registries('totalPodryadchik')}
                    <b className={'margin-left-15'}>
                      {this.renderSumFor('payedSum', data) ? this.renderSumFor('payedSum', data) : '-'}
                    </b>
                  </div>
                </div>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

Table.contextTypes = {
  history: PropTypes.object.isRequired,
};
Table.defaultProps = {
  type: 'orders',
  sumProperty: 'sum_in_coins',
};
Table.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  sortBy: PropTypes.func,
  onScroll: PropTypes.func,
  sumProperty: PropTypes.string,
  emptyState: PropTypes.element,
  isLoading: PropTypes.bool,
  onDropDownChange: PropTypes.func,
  onCheckBoxChange: PropTypes.func,
  onClick: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { dictionaries, sidebarState, user } = state;
  return { dictionaries, sidebarState, user };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({}, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
