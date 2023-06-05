import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';

export const FavoriteCellActionProps = {
  popoverProps: PropTypes.object,
  setPopoverOpen: PropTypes.func,
};

export default function withAddressFavoriteCellAction(WrappedComponent) {
  function FavoriteCellAction(props) {
    const { popoverProps, setPopoverOpen, children, ...otherProps } = props;

    const [visible, setVisible] = React.useState(false);

    const popoverClose = React.useCallback(() => {
      setVisible(false);
      if (setPopoverOpen) {
        setPopoverOpen(false);
      }
    }, []);

    const handleVisibleChange = React.useCallback((visible) => {
      setVisible(visible);
      if (setPopoverOpen) {
        setPopoverOpen(visible);
      }
    }, []);

    return (
      <Ant.Popover
        placement="top"
        {...popoverProps}
        overlayClassName={'address-favorite-action-popover'}
        visible={visible}
        onVisibleChange={handleVisibleChange}
        trigger="click"
        content={<WrappedComponent {...otherProps} popoverClose={popoverClose} />}
      >
        {children}
      </Ant.Popover>
    );
  }

  FavoriteCellAction.propTypes = FavoriteCellActionProps;

  return FavoriteCellAction;
}
