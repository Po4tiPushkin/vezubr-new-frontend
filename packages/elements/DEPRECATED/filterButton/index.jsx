import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Icon from '../icon/icon';
import cn from 'classnames';
import MenuDropDown from '../../menuDropDown';

const FilterButton = (props) => {
  const {
    icon: iconInput,
    iconHover,
    content,
    withMenu,
    menuOptions,
    loading,
    theme = 'default',
    className,
    ...otherProps
  } = props;
  const [icon, setIcon] = useState(iconInput);

  const onMouseEnter = useCallback((onHover) => {
    if (iconHover) {
      if (onHover) {
        setIcon(iconHover)
      }
      else {
        setIcon(iconInput)
      }
    }
  }, [iconHover, iconInput]);

  return (
    <div className="filter-button-wrapper flexbox center">
      <button
        type="button"
        className={cn('filter-button', className, theme, { loading: loading })}
        onMouseLeave={() => onMouseEnter(false)}
        onMouseEnter={() => onMouseEnter(true)}
        {...otherProps}
      >
        <span className={'icon-content'} style={{ paddingLeft: !icon ? 24 : undefined }}>
          {!!loading && <Icon name="spinBlue" className={'icon-small'} />}
          {icon && !loading && <Icon name={icon} className={'icon-small'} />}
          {content}
        </span>
      </button>
      {withMenu && <MenuDropDown options={menuOptions} onClose={otherProps.onClick} />}
    </div>
  )
}

export default FilterButton;