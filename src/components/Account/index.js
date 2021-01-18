import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import Header from '../Home/header';

const AccountPage = ({ authUser }) => (
  <div className="signin-page">
    <div className="signin-main">
      <h1>Password change</h1>
      {/* <PasswordForgetForm /> */}
      <PasswordChangeForm />
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

const condition = (authUser) => !!authUser;

export default compose(
  connect(mapStateToProps),
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);
