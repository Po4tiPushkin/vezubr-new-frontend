import React, { useContext } from 'react';
import { observer } from "mobx-react";
import PropTypes from 'prop-types';
import { CLS_ROOT } from "./constant";
import { OrderDocumentViewerUploaderContext } from "./context";
import Group from "./group";
import cn from "classnames";

const CLS = `${CLS_ROOT}__groups`;

const Groups = (props) => {
  const { parentId, level, reload } = props;
  const { store } = useContext(OrderDocumentViewerUploaderContext);

  return (
    <div className={cn(CLS, `${CLS}--level-${level}`)}>
      {store.getGroupsByParentId(parentId).map(([key, group]) => (
        <Group reload={reload} key={key} group={group} level={level} />
      ))}
    </div>
  );
};

Groups.propTypes = {
  parentId: PropTypes.string,
  level: PropTypes.number,
};

export default observer(Groups);
