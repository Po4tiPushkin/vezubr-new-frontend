import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {Ant} from "@vezubr/elements";
import { CONTOUR_ROLES } from "@vezubr/common/constants/contour";

const CLS = 'registration-roles';
const ROLES = [
  ['2', 'Грузовладелец'],
  ['4', 'Экспедитор'],
  ['1', 'Перевозчик'],
];

function RegisterStep0(props) {
  const { onComplete, contourInfo } = props;

  const renderRoles = useMemo(() => ROLES.map(([key, text]) => {
    return (
      <Ant.Button key={key} className={`${CLS}__item`} onClick={() => onComplete(key)}>
        {text}
      </Ant.Button>
    );
  }), [ROLES]);

  return (
    <div className={CLS}>
     {contourInfo ? 
      <div>
        <p style={{ fontWeight: 600 }}>
          Зарегистрироваться в контуре {`${CONTOUR_ROLES[contourInfo.role]} ${contourInfo.title}`}  как: 
        </p>
      </div> : null}
      {renderRoles}
    </div>
  )
}

RegisterStep0.propTypes = {
  roles: PropTypes.object,
  onComplete: PropTypes.func,
}

export default RegisterStep0;