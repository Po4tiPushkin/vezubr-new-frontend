import React from 'react';
import cn from 'classnames';
import { Ant } from '@vezubr/elements';
import { BargainItemProps } from '../../types';

const defaultAvatarConfig = {
  icon: 'user',
  shape: 'circle',
};

function BargainItem(props) {
  const { className, children, avatarConfig, align = 'left', info } = props;

  const hasAvatar = !!avatarConfig;

  const avatar = React.useMemo(
    () =>
      avatarConfig && (
        <div className={'bargain-item__avatar'}>
          <Ant.Avatar {...{ ...defaultAvatarConfig, ...avatarConfig }} size={40} />
        </div>
      ),
    [avatarConfig],
  );

  return (
    <div className={cn(className, 'bargain-item', `bargain-item--${align}`, { 'bargain-item--has-avatar': hasAvatar })}>
      <div className={'bargain-item__body'}>
        {align === 'left' && avatar}

        <div className={'bargain-item__message'}>
          <div className={'bargain-item__message__items'}>{children}</div>
        </div>

        {align === 'right' && avatar}
      </div>
      {info && <div className={'bargain-item__info'}>{info}</div>}
    </div>
  );
}

BargainItem.propTypes = BargainItemProps;

export default BargainItem;
