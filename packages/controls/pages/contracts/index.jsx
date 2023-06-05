import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../infrastructure/actions';
import { Utils } from '@vezubr/common/common';
import TabsDeprecated from '@vezubr/components/DEPRECATED/tabs/tabs';
import { WhiteBoxDeprecated, IconDeprecated, Loader } from '@vezubr/elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DocElem from './docElem';

function Contracts(props) {
  const history = useHistory();
  const { location, route, mode, type, documentOrderIds, actions, loadingDocs, hasNoTypePage } = props;

  if (hasNoTypePage || !type) {
    return <h1>Страница {location.pathname} не найдена</h1>;
  }

  const isAdmin = mode === 'admin';

  const pageTitle = useMemo(() => Utils.getContractNameById(type), [type]);

  const docsIds = [...documentOrderIds];

  const lastFileId = docsIds.length > 0 ? docsIds.shift() : null;
  const otherFilesIds = docsIds.length > 0 ? docsIds : null;

  const routesChildren = route?.sub;
  const routeChildrenActive = routesChildren?.find((route) => route.url === location.pathname);

  return (
    <div className="contracts-view">
      <TabsDeprecated history={history} data={routesChildren} activeUrl={routeChildrenActive?.url} />
      <WhiteBoxDeprecated className={'stretch'}>
        <div className={'white-box-header'}>
          <div className={'white-box-icon-wrapper'}>
            <IconDeprecated name={'actsOrange'} />
          </div>
          <h3>{pageTitle}</h3>
        </div>
        {!loadingDocs ? (
          <>
            <div className="contracts-view-last">
              <div className="doc-items">
                {lastFileId && (
                  <DocElem key={lastFileId} docId={lastFileId} defaultButtonText={pageTitle} mode={mode} type={type} />
                )}

                {isAdmin && (
                  <DocElem
                    docId={'new'}
                    key={'new' + Math.random()}
                    defaultButtonText={pageTitle}
                    mode={mode}
                    type={type}
                  />
                )}
              </div>
            </div>

            {otherFilesIds && (
              <div className="contracts-view-other">
                <h2>История</h2>
                <div className="doc-items">
                  {otherFilesIds.map((docId) => (
                    <DocElem key={docId} defaultButtonText={pageTitle} docId={docId} mode={mode} type={type} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </WhiteBoxDeprecated>
    </div>
  );
}

Contracts.propTypes = {
  mode: PropTypes.oneOf(['admin', 'viewer']).isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { routes } = state;
  const route = routes.contracts;
  const { location } = state.router;

  let type = null;

  const matchType = location.pathname.match(/\d+/);

  if (matchType) {
    type = parseInt(matchType[0], 10);
  }

  const documents = state.contracts.documents;

  const hasNoTypePage = Object.keys(documents).length === 0 || !state.contracts.documents[type];

  const documentOrderIds = documents[type]?.filesOrder || [];
  const loadingDocs = state.contracts.loadingDocs;

  return {
    type,
    hasNoTypePage,
    route,
    location,
    documentOrderIds,
    loadingDocs,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.contracts }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contracts);
