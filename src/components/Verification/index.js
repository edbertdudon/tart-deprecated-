import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import PasswordResetForm from '../PasswordReset';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const Verification = (props) => {
  // const [verified, setVerified] = useState(false)
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');
    switch (mode) {
      case 'resetPassword':
        props.firebase.doVerifyPasswordResetCode(actionCode)
          .then((email) => setEmail(email))
          .catch((err) => setError(err));
        break;
      case 'recoverEmail':
        break;
      case 'verifyEmail':
        props.firebase.doVerifyEmail(urlParams.get('oobCode'))
          .then((resp) => {
            props.history.push(ROUTES.HOME);
            // setVerified(true)
          })
          .catch((err) => setError(err));
        break;
    }
  }, []);

  const renderSwitch = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');
    switch (mode) {
      case 'resetPassword':
        if (error === null) {
          return (
            <div>
              <h1>Password change</h1>
              <PasswordResetForm actionCode={actionCode} email={email} />
            </div>
          );
        }
        break;
      case 'verifyEmail':
        if (error === null) {
          return (
            <div>
              <h1>Welcome.</h1>
              <p>Verifying email address.</p>
            </div>
          );
        }
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-main">
        {renderSwitch()}
        {error && <p>{error.message}</p>}
      </div>
    </div>
  );
};

export default compose(
  withFirebase,
  withRouter,
)(Verification);
