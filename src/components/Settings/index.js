import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './index.less';

import {
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { withFirebase } from '../Firebase';
import Header from '../Home/header';
import * as ROUTES from '../../constants/routes';

const SettingsPage = (props) => (
  <div className="home">
    <Header />
    <div className="home-settings">
      <div className="home-settings-left">
        <h1>Settings</h1>
      </div>
      <h3>Colors</h3>
      <Colors props={props} authUser={props.authUser} />
      <hr />
      <h3>Reset Password</h3>
      {/* <AccountPage /> */}
      <Link style={{ marginLeft: '20px' }} to={ROUTES.ACCOUNT}>Change Password</Link>
    </div>
  </div>
);

const COLORS_APP = [
  'rgb(53,53,53)',
  'rgb(0,181,170)',
  'rgb(255,162,0)',
];

const Colors = ({ props, authUser }) => {
  const handleColor = (color) => {
    // props.firebase.color(authUser.uid).set({
    //     color: color
    //   })
    props.firebase.user(authUser.uid).update({
      color,
    });

    props.onSetColor(color, authUser.uid);
  };

  return (
    <div className="home-content-settings-text">
      <button
        style={{
          backgroundColor: COLORS_APP[0],
          'box-shadow': (COLORS_APP[0] === props.color[authUser.uid]) ? 'inset 0px 0px 0px 3px #fff' : 'none',
          border: (COLORS_APP[0] === props.color[authUser.uid]) ? `1px solid ${props.color[authUser.uid]}` : 'none',
        }}
        onClick={() => handleColor(COLORS_APP[0])}
      />
      <button
        style={{
          backgroundColor: COLORS_APP[1],
          'box-shadow': (COLORS_APP[1] === props.color[authUser.uid]) ? 'inset 0px 0px 0px 3px #fff' : 'none',
          border: (COLORS_APP[1] === props.color[authUser.uid]) ? `1px solid ${props.color[authUser.uid]}` : 'none',
        }}
        onClick={() => handleColor(COLORS_APP[1])}
      />
      <button
        style={{
          backgroundColor: COLORS_APP[2],
          'box-shadow': (COLORS_APP[2] === props.color[authUser.uid]) ? 'inset 0px 0px 0px 3px #fff' : 'none',
          border: (COLORS_APP[2] === props.color[authUser.uid]) ? `1px solid ${props.color[authUser.uid]}` : 'none',
        }}
        onClick={() => handleColor(COLORS_APP[2])}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  color: (state.colorState.colors || {}),
});

const mapDispatchToProps = (dispatch) => ({
  onSetColor: (color, uid) => dispatch({ type: 'COLOR_SET', color, uid }),
});

const condition = (authUser) => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(SettingsPage);
