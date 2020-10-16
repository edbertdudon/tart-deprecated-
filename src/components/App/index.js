import React from 'react';
import { compose } from 'recompose'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import Home from '../Home';
import Worksheet from '../Worksheet'
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import PasswordForgetPage from '../PasswordForget';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Verification from '../Verification'
import SettingsPage from '../Settings'
import Connections from '../Connections'
import Inputs from '../Inputs'
import Trash from '../Trash'
import Search from '../Search'
import Jobs from '../Jobs'
// import About from '../About'
// import Product from '../About/AboutProduct'

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session'

const App = () => (
  <Router>
    <div>
			<Navigation />
			<Route exact path={ROUTES.HOME} component={Home} />
			<Route path={ROUTES.WORKSHEET} component={Worksheet} />
			<Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
		  <Route path={ROUTES.VERIFICATION} component={Verification} />
      <Route path={ROUTES.SETTINGS} render={SettingsPage} />
      <Route path={ROUTES.CONNECTIONS} component={Connections} />
      <Route path={ROUTES.INPUTS} component={Inputs} />
      <Route path={ROUTES.TRASH} component={Trash} />
      <Route path={ROUTES.SEARCH} component={Search} />
      <Route path={ROUTES.JOBS} component={Jobs} />
		  {/*<Route exact path={ROUTES.ABOUT__PRODUCT} component={Product}/>
      <Route exact path={ROUTES.ABOUT} component={About} /> */}
    </div>
  </Router>
)

export default withAuthentication(App);
