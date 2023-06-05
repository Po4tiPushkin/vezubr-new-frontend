import React from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm, showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { Profile as ProfileService } from '@vezubr/services';

const CLS = 'settings-delegation-form';

const FIELDS = {};

const SettingsDelegationForm = ({ form }) => {
  return (
    <Ant.Form>
      <VzForm.Group></VzForm.Group>
    </Ant.Form>
  );
};

SettingsDelegationForm.propTypes = {
  form: PropTypes.object,
};

export default Ant.Form.create({})(SettingsDelegationForm);
