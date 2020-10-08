// Note
// Implement the "Send confirmation E-Mail" button in a way that it's not shown the first time a user signs up;
// otherwise the user may be tempted to click the button right away and receives a second confirmation E-Mail.

import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { withFirebase } from '../Firebase'

const needsEmailVerification = authUser => 
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password')

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props)

      this.state = { isSent: false }
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => {
          this.setState({ isSent: true })
        })
    }

    render() {
      return (
        // <AuthUserContext.Consumer>
        //   {authUser => 
            needsEmailVerification(this.props.authUser) ?  (
              <div className='home-screen'>
                <div className='home-content'>
                  <div className='home-content-email-verification-wrapper'>
                    {this.state.isSent ? (
                      <div className='home-content-email-verification'>
                        <h1>Email confirmation sent.</h1>
                        <p>
                          Check your emails (Spam
                          folder included) for a confirmation email.
                          Refresh this page once you confirmed your email.
                        </p>
                      </div>
                    ) : (
                      <div className='home-content-email-verification'>
                        <h1>Verify your email.</h1>
                        <p>
                          Check your emails (Spam folder 
                          included) for a confirmation email or send
                          another confirmation email.
                        </p>
                      </div>
                    )}
                    <br />
                    <button
                      type="button"
                      onClick={this.onSendEmailVerification}
                      disabled={this.state.isSent}
                    >
                      Send confirmation email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Component {...this.props} />
            )
        //   }
        // </AuthUserContext.Consumer>
      )
    }
  }

  const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withFirebase,
    connect(mapStateToProps),
  )(WithEmailVerification)
}

export default withEmailVerification