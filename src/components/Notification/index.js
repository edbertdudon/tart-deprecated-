import React, { useState, useRef } from 'react';
import { useOutsideClick } from '../../functions';
import './index.less';

const getNotificationStates = (item) => ({
  notification: <div className="notification-item" key={item.key}>{item.key}</div>,
});

const withNotification = (Component) => (props) => {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useOutsideClick(wrapperRef, setIsOpen);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleHover = () => setHover(!hover);

  const handleClear = () => props.onSetNotifications([]);

  return (
    <div className="notification" ref={wrapperRef}>
      <Component
        hover={hover}
        onHover={handleHover}
        isOpen={isOpen}
        onOpen={handleOpen}
        color={props.color}
      />
      {isOpen
        && (
        <div className="notification-content" style={props.style}>
          <div className="notification-header">
            {props.header}
            <div className="notification-clear" onClick={handleClear} style={{ color: props.color }}>clear</div>
          </div>
          {props.items.map((item, i) => getNotificationStates(item, i)[item.type])}
        </div>
        )}
    </div>
  );
};

export default withNotification;
