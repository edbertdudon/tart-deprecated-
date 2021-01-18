import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClockTimeNine } from '@mdi/js';

import withDropdown from '../Dropdown';
import withNotification from '../Notification';
import { withFirebase } from '../Firebase';
import { OFF_COLOR } from '../../constants/off-color';
import * as ROUTES from '../../constants/routes';

const USER_DROPDOWN = [
  { key: 'Sign out', type: 'item' },
  { key: 'Settings', type: 'link', path: ROUTES.SETTINGS },
];

const Header = ({
  firebase, authUser, color, notifications, onSetNotifications,
}) => {
  const handleDropdown = (i) => firebase.doSignOut();

  return (
    <div className="home-header">
      <NotificationWithNotification
        header="Notifications"
        items={notifications}
        color={OFF_COLOR[color[authUser.uid]]}
        style={{ marginLeft: 'calc(100% - 375px)', marginTop: '42px' }}
        onSetNotifications={onSetNotifications}
      />
      <UserWithDropdown
        text={authUser.firstname}
        items={USER_DROPDOWN}
        onSelect={handleDropdown}
        color={OFF_COLOR[color[authUser.uid]]}
        style={{ marginLeft: 'calc(100% - 195px)' }}
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
  >
    {text}
  </div>
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
  >
    <Icon path={mdiClockTimeNine} size={1} />
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
