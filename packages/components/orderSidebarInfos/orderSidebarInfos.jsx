import React from 'react';
import PropTypes from 'prop-types';
import { Ant, GeoZones as GeoPassess, IconDeprecated } from '@vezubr/elements'
import InputMask from 'react-input-mask';
import t from '@vezubr/common/localization';
import _isEmpty from 'lodash/isEmpty';
import { Common as CommonService } from '@vezubr/services';
import Utils from '@vezubr/common/common/utils';
import InputField from '../inputField/inputField';
import cn from 'classnames';

const API_VERSION = window.API_CONFIGS[APP].apiVersion;

const fileDownload = async (e, fileData) => {
  e.preventDefault();
  e.stopPropagation();
  const file = await CommonService.getImage(
    (fileData.download_url || fileData.downloadUrl).replace(`/${API_VERSION}`, ''),
  );
  const blob = new Blob([file.data], { type: file.headers['content-type'] });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${fileData.original_name}`;
  link.click();
};

const openFile = async (fileData) => {
  const fileUrl = Utils.concatRootImageUrl(
    (fileData.download_url || fileData.downloadUrl).replace(`/${API_VERSION}`, ''),
  );
  const win = window.open(fileUrl, '_blank');
  win.focus();
};

const imageRenderer = (val) => {
  const p =
    val.value?.previews?.find((el) => el.widthInPx === 84).downloadUrl.replace('/', '') ||
    val.value?.downloadUrl?.replace('/', '');
  const preview = window.API_CONFIGS[APP].host + p;
  return (
    <div className={'size-1'}>
      {val.value ? (
        <div
          onClick={() => openFile(val.value)}
          className={`driver-box flexbox margin-top-12`}
          style={{ padding: '4px 12px', cursor: 'pointer', width: '100%' }}
        >
          <div className={'empty-attach-input'}>
            <img style={{ width: '84px' }} src={preview} />
          </div>
          <div className={'flexbox column align-left justify-left margin-left-16'}>
            <span>{val.title}</span>
            <span>{val.value.originalName}</span>
          </div>
          <div className={'flexbox size-1 justify-right center'}>
            <IconDeprecated
              className={'margin-left-26 pointer'}
              onClick={(e) => fileDownload(e, val.value)}
              name={'chevronRightOrange'}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const defaultRender = (val, key, column, length, sizeVal) => {
  return (
    <div className={`flexbox size-1 ${val?.divClass ? val.divClass : ''}`}>
      <span
        className={`flexbox ${sizeVal ? sizeVal : val.comment ? 'size-0_3' : val.balance || val.noVal ? 'size-1' : 'size-0_5'
          } ${val.titleClass ? val.titleClass : ''}
			order-title ${key === length - 1 || column ? 'last' : ''} ${val.onClick ? 'align-center pointer' : ''}`}
      >
        {val.title}
        {val.onClick ? <IconDeprecated name={'chevronRightOrange'} /> : null}
      </span>
      <span
        className={`flexbox bold ${val.comment ? 'size-1 margin-left-12' : val.balance ? 'size-0_3 justify-right padding-right-20' : 'size-0_5'
          }
					${val.valueClass || ''}
          ${val.value === 'Да' ? 'info-value__orange' : ''}
					order-title order-value ${key === length - 1 || column ? 'last' : ''}`}
      >
        {val.input ? (
          val.masked ? (
            val.preparatorOldNew && Array.isArray(val.preparatorOldNew)
              ?
              <>
                <div className="flexbox preparators-single__old">{
                  <InputMask
                    style={{ padding: 0, border: 0, maxWidth: '132px', fontWeight: 'bold' }}
                    mask={val.masked}
                    value={val.preparatorOldNew[0]}
                  />}
                </div>
                <div className="flexbox preparators-single__arrow"> {`->`} </div>
                <InputMask
                  style={{ padding: 0, border: 0, maxWidth: '125px' }}
                  mask={val.masked}
                  value={val.preparatorOldNew[1]}
                />
                <div className="flexbox preparators-single__hint">
                  <Ant.Tooltip placement="right" title={t.order('newValueHint')}>
                    <Ant.Icon type={'info-circle'} />
                  </Ant.Tooltip>
                </div>
              </>
              :
              val.value
                ? <InputMask style={{ padding: 0, border: 0 }} mask={val.masked} value={val.value} />
                : '-'
          ) : (
            <input mask={val.mask || false} value={val.value} />
          )
        ) : Array.isArray(val.value) ? (
          val.value.map((v) => v.name).join(', ')
        ) : (
          val.value
        )}
      </span>
    </div>
  );
};

const singleRenderer = (val) => {
  return val?.value;
}

const expandRenderer = (val, key, column, length) => {
  return val.show !== false ? (
    <Ant.Collapse
      style={{
        width: '100%',
        padding: '0px',
        margin: '12px 0'
      }}
      className={(val.className || '')}
    >
      {Array.isArray(val.value) ? (
        val.value.map((item) => (
          <Ant.Collapse.Panel header={val.title}>{dataRenderer(val.value[0], column, true)}</Ant.Collapse.Panel>
        ))
      ) : (
        <Ant.Collapse.Panel header={val.title}>{dataRenderer(val.value, column, true)}</Ant.Collapse.Panel>
      )}
    </Ant.Collapse>
  ) : null;
}

const datesRenderer = (val) => {
  return val.show ? (
    <div className={'flexbox size-1 margin-top-12'}>
      {val.list.map((v, k) => {
        return (
          <div key={k} className={'flexbox size-1'}>
            <InputField
              className={`${k > 0 ? 'margin-left-12' : ''}`}
              title={v.title}
              type={'text'}
              shortInfo={{}}
              datePicker={true}
              readonly={true}
              value={v.value}
              onChange={(e) => null}
            />
          </div>
        );
      })}
    </div>
  ) : null;
};

const geoPassesRenderer = (val) => {
  return val.list.map((val, key) => {
    return (
      <div key={key} className={`flexbox size-1 center ${key > 0 ? 'margin-top-8' : ''}`}>
        <GeoPassess
          className={'size-1'}
          detail={val.title}
          name={`gz_${key}`}
          placeholder={'Выберите тип пропуска'}
          title={'Тип пропуска'}
          readOnly={true}
          data={{}}
        />
        <InputField
          style={{ height: '64px' }}
          className={'size-0_5 margin-left-8'}
          title={t.order('expiresAt')}
          type={'text'}
          name={`gz_d_${key}`}
          shortInfo={{}}
          datePicker={true}
          strictFormat={true}
          placeholder={'дд.мм.гггг'}
          mask={'99.99.9999'}
          allowManual={true}
          readonly={true}
          value={val.value || ''}
        />
      </div>
    );
  });
};

const dataRenderer = (data, column, isArray = false) => {
  const length = data.length;
  return data.map((val, key) => {
    if (_isEmpty(val) || val.show === false) {
      return null
    }
    return (
      <div
        key={key}
        className={`flexbox ${isArray && length === 1 ? 'half' : 'full'}-width ${val.rootClass || ''}`}
        onClick={val.onClick ? val.onClick : null}
      >
        {Array.isArray(val)
          ? val.map((vv, kk) => defaultRender(vv, `${kk}+${key}`, column, length, 'size-0_9'))
          : val.image
            ? imageRenderer(val)
            : val.dates
              ? datesRenderer(val)
              : val.geoPasses
                ? geoPassesRenderer(val)
                : val.single
                  ? singleRenderer(val)
                  : val.expand
                    ? expandRenderer(val, key, column, length)
                    : defaultRender(val, key, column, length)}
      </div>
    );
  });
};

function OrderSidebarInfos({ ...props }) {
  const { column, className, date, extraClassName } = props;
  let data = [];
  let render = <div />;
  if (!props.data || !props.data[0]) return render;
  if (typeof props.data[0][0] === 'undefined') {
    data = dataRenderer(props.data, column);
    render = <div className={cn('box-wrapper', { 'flexbox': column, [className]: !column }, extraClassName)}>{data}</div>;
  } else {
    data = props.data.map((val, key) => {
      const items = dataRenderer(val, column, true);
      return (
        <div key={key} className={`full-width border-top-bottom ${column ? 'flexbox' : ''}`}>
          {items}
        </div>
      );
    });
    render = <div className={cn(`box-wrapper flexbox`, extraClassName)}>{data}</div>;
  }

  return render;
}

OrderSidebarInfos.propTypes = {
  data: PropTypes.array.isRequired,
  extraClassName: PropTypes.string,
};

export default OrderSidebarInfos;
