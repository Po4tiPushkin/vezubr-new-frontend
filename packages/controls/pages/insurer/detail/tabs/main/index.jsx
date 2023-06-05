import React, { useState, useMemo } from 'react';
import MainForm from '../../../../../forms/insurer/insurer-main-form';

const Main = (props) => {
  const {
    company
  } = props;

  return (
    <MainForm
      values={company}
    />
  );
}


export default Main;