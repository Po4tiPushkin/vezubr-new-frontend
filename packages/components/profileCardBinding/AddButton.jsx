import React from 'react';
import autobind from 'autobind-decorator';
import { Profile as ProfileService } from '@vezubr/services';
import t from '@vezubr/common/localization';

import PropTypes from 'prop-types';
import { ButtonDeprecated } from '@vezubr/elements';

class AddButton extends React.Component {
  @autobind
  async onCreateBindingInit() {
    const { actions } = this.props;
    actions.setLoadingInitialUrl(true);
    try {
      const response = await ProfileService.contractorBindingCreateInit();
      if (response && response.data && response.data.formUrl) {
        window.location = response.data.formUrl;
      }
    } catch (e) {
      console.error(e);
    }

    actions.setLoadingInitialUrl(false);
  }

  render() {
    const { initialUrlLoading, title, className } = this.props;
    return (
      <ButtonDeprecated
        theme={'primary'}
        loading={initialUrlLoading}
        onClick={this.onCreateBindingInit}
        className={className}
      >
        {title}
      </ButtonDeprecated>
    );
  }
}

AddButton.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

AddButton.defaultProps = {
  title: t.profile('bindCard'),
  className: 'mid',
};

AddButton.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
};


export default AddButton;