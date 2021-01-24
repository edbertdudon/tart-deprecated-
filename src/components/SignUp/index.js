import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './index.less';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const Footer = () => (
  <div className="footer">
    <Link to={ROUTES.HOME}>App</Link>
    <p>Copyright © 2020 Tart. All rights reserved.</p>
  </div>
);

const SignUpPage = () => (
  <div className="signin-page">
    <div className="signup-main">
      <h1 className="signin-title">Create Tart ID</h1>
      <SignUpForm />
    </div>
    <Footer />
  </div>
);

const INITIAL_STATE = {
  firstname: '',
  lastname: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  // phoneNumber: '',
  dob: '',
  country: '',
  // isAdmin: false,
  isSubscribed: true,
  error: null,
  errorPassword: null,
  color: 'rgb(53,53,53)',
};

// const SAMPLE_WORKSHEET = new File([worksheet], 'Sample Worksheet', {type: "application/json"})
// const SAMPLE_RUN = new File([run], 'Sample Worksheet run', {type: "application/json"})

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (e) => {
    const {
      firstname, lastname, email, passwordOne, isSubscribed, country, dob, color, errorPassword,
    } = this.state;
    const roles = {};
    const isInvalidPassword =		passwordOne.length < 8
		|| /\s/.test(passwordOne)
		|| !/^[\x00-\x7F]*$/.test(passwordOne)
		|| !/\d/.test(passwordOne);

    if (isInvalidPassword) {
      this.setState({ errorPassword: 'password must have at least 8 characters (ASCII) and include numbers.' });
      e.preventDefault();
      return false;
    }

    // if (isAdmin) {
    //   roles[ROLES.ADMIN] = ROLES.ADMIN
    // }

    if (isSubscribed) {
      roles[ROLES.SUBSCRIBED] = ROLES.SUBSCRIBED;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then((authUser) => {
        // Create user in your Firebase realtime database
        this.props.firebase
          .user(authUser.user.uid)
          .set({
            firstname,
            lastname,
            email,
            roles,
            country,
            dob,
            color,
          });
        return authUser;
      })
      .then((authUser) => {
        this.props.firebase.doSendEmailVerification();
        return authUser;
      })
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });

        // Create example documents in Firebase storage
        // this.props.firebase.doUploadWorksheet(authUser.user.uid, 'Sample Worksheet', SAMPLE_WORKSHEET)
        // this.props.firebase.doUploadWorksheet(authUser.user.uid, 'Sample Worksheet run', SAMPLE_RUN)
        // this.props.firebase.doCopySample(authUser.user.uid)

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

  onChangeCheckbox = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  }

  render() {
    const {
      firstname,
      lastname,
      email,
      passwordOne,
      passwordTwo,
      // isAdmin,
      isSubscribed,
      // phoneNumber,
      dob,
      country,
      error,
	  errorPassword,
    } = this.state;

    const isInvalid = passwordOne !== passwordTwo
      || passwordOne === ''
      || email === ''
      || firstname === ''
      || lastname === ''
      // phoneNumber === '' ||
      || dob === ''
      || country === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div className="signin-form-name">
          <input
            name="firstname"
            value={firstname}
            onChange={this.onChange}
            type="text"
            placeholder="First name"
          />
        </div>
        <div className="signin-form-name">
          <input
            name="lastname"
            value={lastname}
            onChange={this.onChange}
            type="text"
            placeholder="Last name"
          />
        </div>
        <br />
        <div className="signin-form">
          <input
            name="country"
            value={country}
            onChange={this.onChange}
            type="country"
            placeholder="Country"
          />
        </div>
        <br />
        <div className="signin-form">
          <input
            name="dob"
            value={dob}
            onChange={this.onChange}
            type="date"
            required="required"
            placeholder="Date of Birth"
          />
        </div>
        {/* <br />
        <hr /> */}
        <br />
        <div className="signin-form">
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email address"
          />
        </div>
        <br />
        <div className="signin-form">
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </div>
        <br />
        <div className="signin-form">
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm password"
          />
        </div>
        {/* <br />
        <div className='signin-form'>
          <input
            name="phoneNumber"
            value={phoneNumber}
            onChange={this.onChange}
            type="text"
            placeholder="Phone Number"
          />
        </div> */}
        <br />
        <label>
          <input
            name="isSubscribed"
            type="checkbox"
            checked={isSubscribed}
            onChange={this.onChangeCheckbox}
          />
          &nbsp;Announcements
        </label>
        <br />
        <input disabled={isInvalid} type="submit" value="Create" style={{ color: isInvalid ? 'rgb(0, 0, 0, 0.5)' : '#0071e3' }} />
        {errorPassword && (
        <p>
          {errorPassword}
          {' '}
        </p>
        )}
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p className="signup-link">
    <Link to={ROUTES.SIGN_UP}>Create Tart ID</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
