import React, { useState, useRef } from 'react';
import { useOutsideClick } from '../../functions';
import './index.less';

const getNotificationStates = (item) => ({
  notification: <div className="notification-item" key={item.key}>{item.key}</div>,
});

const withNotification = (Component) => ({
  color, style, header, items, onSetNotifications,
}) => {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useOutsideClick(wrapperRef, setIsOpen);

  const handleOpen = () => setIsOpen(!isOpen);
  const handleHover = () => setHover(!hover);

  // const handleClear = () => onSetNotifications([]);

  return (
    <div className="notification" ref={wrapperRef}>
      <Component
        hover={hover}
        onHover={handleHover}
        isOpen={isOpen}
        onOpen={handleOpen}
        color={color}
      />
      {isOpen
        && (
        <div className="notification-content" style={style}>
          <div className="notification-header">
            {header}
          </div>
          {items.map((item, i) => getNotificationStates(item, i)[item.type])}
        </div>
        )}
    </div>
  );
};

// <div
//   className="notification-clear"
//   onClick={handleClear}
//   style={{ color: props.color }}
// >
//   clear
// </div>

export default withNotification;
