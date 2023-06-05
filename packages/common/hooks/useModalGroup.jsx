import React from 'react';

export default function useModalGroup() {
  const [modals, setModals] = React.useState({});

  const modalIsVisible = React.useCallback(
    (modalName) => {
      return !!modals?.[modalName];
    },
    [modals],
  );

  const modalSetVisible = React.useCallback(
    (modalName, value) => {
      const newModals = {
        ...modals,
        [modalName]: value,
      };

      setModals(newModals);
    },
    [modals],
  );

  const modalToggle = React.useCallback(
    (modalName) => {
      modalSetVisible(modalName, !modalIsVisible(modalName));
    },
    [modalSetVisible, modalIsVisible],
  );

  const modalGetToggleFunc = React.useCallback(
    (modalName) => {
      return () => {
        modalToggle(modalName);
      };
    },
    [modalToggle],
  );

  return {
    modalIsVisible,
    modalToggle,
    modalSetVisible,
    modalGetToggleFunc,
  };
}
