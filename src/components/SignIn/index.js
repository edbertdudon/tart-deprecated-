import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';

import './index.less';

import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpLink = () => (
  <p className="signup-link">
    <Link to={ROUTES.SIGN_UP}>Create Tart ID</Link>
  </p>
);

const Footer = () => (
  <div className="footer">
    <Link to={ROUTES.HOME}>App</Link>
    <p>Copyright © 2020 Tart. All rights reserved.</p>
  </div>
);

const SignInPage = () => (
  <div className="signin-page">
    <div className="signin-main">
      <p className="signin-title">Sign in to Tart</p>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
    <Footer />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (e) => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    e.preventDefault();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div className="signin-form">
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Tart ID"
          />
          <hr className="signin-form-hr" />
          <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
          <input disabled={isInvalid} type="submit" style={{ color: isInvalid ? 'rgb(0, 0, 0, 0.5)' : '#0071e3' }} />
        </div>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
