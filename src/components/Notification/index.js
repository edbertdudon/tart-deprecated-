import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import './index.less';

import { OFF_COLOR } from '../../constants/off-color';

const getNotificationStates = (item, i) => ({
  notification: <div className="notification-item" key={item.key}>{item.key}</div>,
});

const withNotification = (Component) => (props) => {
  const [hover, setHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const useOutsideAlerter = (ref) => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    });
  };
  useOutsideAlerter(wrapperRef);

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
        style={props.style}
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
