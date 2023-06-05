import React from 'react';
import PropTypes from 'prop-types';
import createHigherOrderComponent from '@vezubr/common/hoc/createHigherOrderComponent';
import useDebouncedSuggestions from '@vezubr/common/hooks/useDebouncedSuggestions';

export const SuggestionsWrapperProps = {
  timer: PropTypes.number.isRequired,
};

const withSuggestions = (createLoaderProps) =>
  createHigherOrderComponent(
    (WrappedComponent) => (outProps) => {
      const { props, loader } = createLoaderProps(outProps);
      const { timer, filterDataSource, ...otherProps } = props;
      let [dataSource, loading, onSearch] = useDebouncedSuggestions(loader, timer);

      if (filterDataSource) {
        dataSource = dataSource?.filter(filterDataSource)
      }

      return <WrappedComponent {...otherProps} loading={loading} dataSource={dataSource} onSearch={onSearch} />;
    },
    'withSuggestions',
    SuggestionsWrapperProps,
  );

export default withSuggestions;
