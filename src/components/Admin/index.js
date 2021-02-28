import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';
// import { withFirebase } from '../Firebase';
import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import Header from '../Home/header';
import UserItem from './UserItem';
import UserList from './UserList';

const AdminPage = () => (
  <div className="home-screen">
    <div className="home-content">
      <Header />
      <h1>Admin</h1>
      <p>This page is accessible by everyone signed in as an admin user</p>

      <Switch>
        <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route exact path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  </div>
);

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AdminPage);
