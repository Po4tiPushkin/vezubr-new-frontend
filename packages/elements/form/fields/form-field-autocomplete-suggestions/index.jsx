import React from 'react';
import PropTypes from 'prop-types';
import _uniqBy from 'lodash/uniqBy';
import { AutoComplete } from '../../../antd';

function FormFieldAutocompleteSuggestions(props, ref) {
  const { dataSource, loading, onSearch, ...otherProps } = props;

  const options = React.useMemo(
    () =>
      _uniqBy(dataSource || [], (s) => s.value).map(({ value, data, text }) => (
        <AutoComplete.Option key={value} data={data} value={value}>
          {text}
        </AutoComplete.Option>
      )),
    [dataSource],
  );

  return (
    <AutoComplete
      ref={ref}
      allowClear={true}
      {...otherProps}
      loading={loading}
      dataSource={options}
      onSearch={onSearch}
    />
  );
}

export default React.forwardRef(FormFieldAutocompleteSuggestions);
