import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiBell } from '@mdi/js';

import withDropdown from '../Dropdown';
import withNotification from '../Notification';
import { withFirebase } from '../Firebase';
import OFF_COLOR from '../../constants/off-color';
import * as ROUTES from '../../constants/routes';

const USER_DROPDOWN = [
  { key: 'Sign out', type: 'item' },
  { key: 'Settings', type: 'link', path: ROUTES.SETTINGS },
];

const Header = ({
  firebase, authUser, color, notifications, onSetNotifications,
}) => {
  const handleDropdown = () => firebase.doSignOut();

  return (
    <div className="home-header">
      <NotificationWithNotification
        classname="notification-home"
        header="Notifications"
        items={notifications}
        color={OFF_COLOR[color[authUser.uid]]}
        onSetNotifications={onSetNotifications}
      />
      <UserWithDropdown
        classname="dropdown-content-user"
        text={authUser.firstname}
        items={USER_DROPDOWN}
        onSelect={handleDropdown}
        color={OFF_COLOR[color[authUser.uid]]}
      />
    </div>
  );
};

const User = ({
  text, hover, onHover, isOpen, onOpen, color,
}) => (
  <div
    className="home-header-user"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
  >{text}</div>
);

const Notification = ({
  hover, onHover, isOpen, onOpen, color,
}) => (
  <button
    className="home-header-button"
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
    type="button"
  >
    <Icon path={mdiBell} size={0.9} />
  </button>
);

const UserWithDropdown = withDropdown(User);
const NotificationWithNotification = withNotification(Notification);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  notifications: (state.notificationsState.notifications || []),
});

const mapDispatchToProps = (dispatch) => ({
  onSetNotifications: (notifications) => dispatch({ type: 'NOTIFICATIONS_SET', notifications }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Header);
