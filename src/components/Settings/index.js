import React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import Colors from './colors';
// import Iteration from './iteration';
import {
  withAuthorization,
  withEmailVerification,
} from '../Session';
import Header from '../Home/header';
import * as ROUTES from '../../constants/routes';
import './index.less';

const SettingsPage = (props) => (
  <div className="home">
    <Header />
    <div className="home-settings">
      <div className="home-settings-left">
        <h1>Settings</h1>
      </div>
      <h3>Colors</h3>
      <Colors authUser={props.authUser} />
      {/*}<hr />
      <h3>Spreadsheet</h3>
      <Iteration />*/}
      <hr />
      <h3>Reset Password</h3>
      {/* <AccountPage /> */}
      <Link style={{ marginLeft: '20px' }} to={ROUTES.ACCOUNT}>Change Password</Link>
    </div>
  </div>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(SettingsPage);
