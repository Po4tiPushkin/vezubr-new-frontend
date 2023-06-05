import React from 'react';
import moment from 'moment';
const Comments = (props) => {
  const { comments = [] } = props;
  return (
    <div className="inner-comments">
      {comments.map((message, key) => {
        return (
          <div key={key} className={'inner-comments__item'}>
            <span className={'inner-comments__info'}>
              {message?.date ? moment(message.date).format('DD.MM.YYYY HH:mm') : null}
            </span>
            <span className="inner-comments__info">{` ${message?.employee?.fullName}: `}</span>
            <span className={'inner-comments__text'}>{message?.text}</span>
          </div>
        );
      })}
    </div>
  )
}

export default Comments;