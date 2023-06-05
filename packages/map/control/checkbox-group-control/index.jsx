import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import Control from 'react-leaflet-control';
import { FeatureGroup } from 'react-leaflet';
import _concat from 'lodash/concat';
import usePrevious from '@vezubr/common/hooks/usePrevious';

function isValidData(data) {
  return Array.isArray(data) ? data.length > 0 : !!data;
}

function createCheckboxOptions(listInput) {
  const list = [];
  for (const key of Object.keys(listInput)) {
    if (isValidData(listInput[key].data) && listInput[key].checked) {
      list.push(key);
    }
  }

  return list;
}

function CheckboxGroupControl(props) {
  const { position, title, list, children } = props;

  const checkboxOptions = React.useMemo(
    () =>
      Object.keys(list)
        .filter((key) => isValidData(list[key].data))
        .map((key) => ({
          label: list[key].name,
          value: key,
        })),
    [list],
  );

  const [checkboxValues, setCheckboxValues] = React.useState(() => createCheckboxOptions(list));

  const positionPopover = React.useMemo(() => {
    switch (position) {
      case 'topleft': {
        return 'rightTop'
      }
      case 'topright': {
        return 'leftTop';
      }
      case 'bottomright': {
        return 'leftBottom';
      }
      case 'bottomleft': {
        return 'rightBottom';
      }
      default: {
        return null
      }
    }
  }, [position]);

  const prevList = usePrevious(list);

  React.useEffect(() => {
    if (prevList && list && prevList !== list) {
      setCheckboxValues(createCheckboxOptions(list));
    }
  });

  const renderChildren = () => {
    let returnItems = [];

    Object.keys(list)
      .filter((key) => checkboxValues.includes(key))
      .map((key) => {
        const currentData = list[key].data;

        if (Array.isArray(currentData)) {
          returnItems = _concat(returnItems, currentData);
        } else {
          returnItems.push(currentData);
        }
      });

    return children ? children(returnItems) : <FeatureGroup>{returnItems}</FeatureGroup>;
  };

  return (
    <>
      <Control className={'leaflet-checkbox-group-control'} position={position}>
        <Ant.Popover
          placement={positionPopover}
          overlayClassName={'leaflet-checkbox-group-control__popover'}
          content={
            <Ant.Checkbox.Group
              className={'leaflet-checkbox-group-control__checkbox-group'}
              value={checkboxValues}
              options={checkboxOptions}
              onChange={setCheckboxValues}
            />
          }
          title={title}
          trigger="click"
        >
          <Ant.Button className={'leaflet-checkbox-group-control__button'} icon={'menu'} />
        </Ant.Popover>
      </Control>

      {renderChildren()}
    </>
  );
}

CheckboxGroupControl.propTypes = {
  position: PropTypes.oneOf(['topleft', 'topright', 'bottomright', 'bottomleft']),
  title: PropTypes.string,
  list: PropTypes.objectOf(
    PropTypes.shape({
      checked: PropTypes.bool,
      name: PropTypes.string,
      data: PropTypes.any,
    }),
  ),
  children: PropTypes.func,
};

export default CheckboxGroupControl;
