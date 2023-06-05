import React from 'react';
import Icon from './../DEPRECATED/icon/icon';
import cn from 'classnames';
import MenuDropDown from './../menuDropDown';

export default function FilterButton(props) {
  const {
    className,
    icon: iconProps,
    iconHover,
    content,
    withMenu,
    menuOptions,
    loading,
    theme = 'default',
    onClose,
    ...otherProps
  } = props;
  const [icon, setIcon] = React.useState(props.icon);

  const onMouseEnter = React.useCallback(
    (onHover) => {
      if (iconHover) onHover ? setIcon(iconHover) : setIcon(icon);
    },
    [icon, iconHover],
  );

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
      {withMenu && <MenuDropDown options={menuOptions} onClose={onClose || otherProps.onClick} />}
    </div>
  );
}
