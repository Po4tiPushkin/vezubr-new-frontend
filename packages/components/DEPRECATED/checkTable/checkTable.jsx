import React, { Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import InputField from '../../inputField/inputField';
import Static from '@vezubr/common/constants/static';

const actions = [t.common('Принять'), t.common('Принять данные API')];

const tableHead = ['Название поля', 'Заполненные данные', 'Данные по API', 'Действие оператора'];

class CheckTable extends React.Component {
  state = {
    showModal: false,
    holdingName: '',
    holdingNameError: false,
    body: [],
  };

  componentWillMount() {
    const { type } = this.props;
    this.setState({ body: Static.getCheckTable(type) });
  }

  componentDidMount() {
    const { tableFillData } = this.props;
    this.fillBody(tableFillData);
  }

  fillBody(arr) {
    const { body } = this.state;
    const { defaultSelect } = this.props;
    for (const d of arr) {
      body[d[0]].data = d[1];
      body[d[0]].apiData = d[2];
      if (d[1] || d[2]) {
        this.handleChange(body[d[0]].prop, {
          key: d[1] ? 0 : 1,
          saveVal: defaultSelect ? d[2] || d[1] : d[1] || d[2],
          val: defaultSelect ? (d[2] ? actions[1] : actions[0]) : d[1] ? actions[0] : actions[1],
        });
      }
    }
    this.setState({ body });
  }

  handleChange(type, val) {
    const { onChange } = this.props;
    onChange(type, val);
  }

  render() {
    const { body } = this.state;
    const { submitData, errors } = this.props;
    const thead = tableHead.map((val, key) => {
      return (
        <th className={''} key={key}>
          <span>{val}</span>
          <span className={'bg-grey_0 th-background'} />
        </th>
      );
    });

    const tbody = body.map((val, key) => {
      return (
        <tr key={key}>
          <td>{val.title}</td>
          <td className={`check-data ${val.data !== val.apiData && val.data && val.apiData ? 'error' : ''}`}>
            {val?.isDate && val.data ? moment(val.data).format('DD/MM/YYYY') : val.data}
          </td>
          <td className={'check-data'}>
            {val?.isDate && val.apiData ? moment(val.apiData).format('DD/MM/YYYY') : val.apiData}
          </td>
          <td>
            <InputField
              style={{
                minHeight: '40px',
                height: '40px',
              }}
              title={''}
              type={'text'}
              placeholder={'Выбрать действие'}
              name={val.prop}
              error={errors[val.prop]}
              value={submitData[val.prop]?.val || ''}
              dropDown={{
                data: actions,
              }}
              onChange={(e) => {
                e.saveVal = e.key === 0 ? val.data : e.key === 1 ? val.apiData : false;
                this.handleChange(val.prop, e);
              }}
            />
          </td>
        </tr>
      );
    });
    return (
      <Fragment>
        <div
          className={'table-container'}
          style={{ overflow: 'inherit', height: 'auto', maxHeight: 'none', marginBottom: '24px' }}
        >
          <table className={'vz-table documents data-check'}>
            <thead>
              <tr>{thead}</tr>
            </thead>
            <tbody>{tbody}</tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

CheckTable.propTypes = {};

export default CheckTable;
