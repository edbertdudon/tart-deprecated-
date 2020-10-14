import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

class PasswordResetForm extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE }

  }

  onSubmit = e => {
    const { passwordOne } = this.state

    this.props.firebase
      .doConfirmPasswordReset(this.props.actionCode, passwordOne)
      .then((resp) => {
        this.setState({ ...INITIAL_STATE })
        this.props.firebase.doSignInWithEmailAndPassword(this.props.email, passwordOne)
          .then(() => {
            this.props.history.push(ROUTES.HOME)
          })
          .catch(error => this.setState(error))
      })
      .catch(error => {
        this.setState({ error })
      })

    e.preventDefault()
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { passwordOne, passwordTwo, error } = this.state

    const isInvalid = 
    passwordOne !== passwordTwo || passwordOne === ''

    return (
      <form onSubmit={this.onSubmit}>
        <div className='signin-form'>
          <input
            name="passwordOne"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
            placeholder="New Password"
          />
          <hr style={{marginLeft: "-7px", border: "none", borderTop: "1px solid #d6d6d6", width: "430px"}}/>
          <input
            name="passwordTwo"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm New Password"
          />

        </div>
        <br/>
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>
        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

export default compose(
  withFirebase,
  withRouter,
)(PasswordResetForm)