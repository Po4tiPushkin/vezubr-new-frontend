import React, { useContext } from 'react';
import { observer } from "mobx-react";
import cn from "classnames";
import PropTypes from 'prop-types';
import { CLS_ROOT } from "./constant";
import { OrderDocumentViewerUploaderContext } from "./context";
import Doc from "./doc";
import Groups from "./groups";

const CLS = `${CLS_ROOT}__group`;

const Group = (props) => {
  const { group, level, reload } = props;
  const { store } = useContext(OrderDocumentViewerUploaderContext);
  return (
    <div className={CLS}>
      <div className={cn(`${CLS}__title`, `${CLS}--level-${level}`)}>{group.title}</div>
      <div className={`${CLS}__docs`}>
        {store.getDocsByGroupId(group.id).map(([key, doc]) => (
          <Doc reload={reload} key={key} doc={doc} />
        ))}
      </div>
      <Groups parentId={group.id} level={level + 1} />
    </div>
  );
};


Group.propTypes = {
  group: PropTypes.object,
  level: PropTypes.number,
};

export default observer(Group);
