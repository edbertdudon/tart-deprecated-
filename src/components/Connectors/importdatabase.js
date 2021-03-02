//
//  ImportDatabase
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import Checkbox from '../RightSidebar/checkbox';
import withModal from '../Modal';
import serverConnect from './serverConnect';
import { withFirebase } from '../Firebase';
import './index.less';

const ImportDatabase = ({
  firebase, authUser, color, databaseType, onClose,
}) => {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [sid, setSid] = useState('');
  const [url, setUrl] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [ssl, setSSL] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    // setHost('')
    // setPort('')
    // setSid('')
    // setUser('')
    // setPassword('')
    // setUrl('')
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleHost = (e) => setHost(e.target.value);
  const handlePort = (e) => setPort(e.target.value);
  const handleSid = (event) => setSid(event.target.value);
  const handleUser = (e) => setUser(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleUrl = (e) => setUrl(e.target.value);
  const handleSSL = () => setSSL(!ssl);

  const handleConnect = () => {
    setLoading(true);
    const data = {
      host,
      user,
      password,
      port,
      url,
      connector: databaseType,
      uid: authUser.uid,
    };
    if (databaseType === 'OracleDB') {
      data.sid = sid;
    }
    serverConnect(firebase, databaseType, data)
      .then(() => {
        setLoading(false);
        handleClose();
      })
      .catch(() => {
        setError('Unable to connect');
        setLoading(false);
      });
  };

  const isInvalid = databaseType === 'OracleDB'
    ? (host === '' || port === '' || sid === '' || user === '' || password === '') && url === ''
    : (host === '' || port === '' || user === '' || password === '') && url === '';

  return (
    <form className="modal-form">
      <div className="importdatabase-inputs">
        <div className="importdatabase-inputs-host">
          <input
            placeholder="localhost"
            type="text"
            name="host"
            onChange={handleHost}
            disabled={url !== ''}
            autoFocus
          />
        </div>
        <div className="importdatabase-inputs-port">
          <input
            placeholder="1433"
            type="text"
            name="port"
            onChange={handlePort}
            disabled={url !== ''}
          />
        </div>
        {databaseType === 'OracleDB' && (
          <>
            <br />
            <div className="importdatabase-inputs-login">
              <input
                placeholder="Oracle system identifier (SID)"
                type="text"
                name="sid"
                onChange={handleSid}
              />
            </div>
          </>
        )}
        <br />
        <div className="importdatabase-inputs-login">
          <input
            placeholder="username"
            type="text"
            name="user"
            onChange={handleUser}
            disabled={url !== ''}
          />
        </div>
        <br />
        <div className="importdatabase-inputs-login">
          <input
            placeholder="password"
            type="password"
            name="password"
            onChange={handlePassword}
            disabled={url !== ''}
          />
        </div>
        <p>or</p>
        <div className="importdatabase-inputs-login">
          <input
            placeholder="url"
            type="text"
            name="url"
            onChange={handleUrl}
            disabled={!(host === '' && port === '' && user === '' && password === '')}
          />
        </div>
        <Checkbox
          onClick={handleSSL}
          condition={ssl}
          text="SSL"
        />
        <div className="importdatabase-textbox">
          {error && <p>{error}</p>}
        </div>
        <p>
          Tart requires credentials to RUN your worksheet.
          Passwords are encrypted. Users have strict read access.
        </p>
        <input
          className="modal-button-left"
          type="button"
          value="Cancel"
          onClick={handleClose}
        />
        {loading ? (
          <div className="modal-loading">
            <Icon path={mdiLoading} size={1.5} spin />
          </div>
        ) : (
          <input
            disabled={isInvalid}
            className="modal-button-right"
            type="button"
            value="Connect"
            onClick={handleConnect}
            style={{ color: isInvalid ? 'rgb(0, 0, 0, 0.5)' : color[authUser.uid] }}
          />
        )}
      </div>
    </form>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
  withModal,
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(ImportDatabase);
