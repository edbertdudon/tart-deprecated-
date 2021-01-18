import React, { useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import './index.less';

import { serverConnect } from './serverConnect';
import { withFirebase } from '../Firebase';

const ImportDatabase = ({
  firebase, authUser, color, databaseType, onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [sid, setSid] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleClose = () => {
    setHost('');
    setPort('');
    setSid('');
    setUser('');
    setPassword('');
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleHost = (event) => setHost(event.target.value);
  const handlePort = (event) => setPort(event.target.value);
  const handleSid = (event) => setSid(event.target.value);
  const handleUser = (event) => setUser(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  const handleConnect = () => {
    setLoading(true);

    const data = {
      host,
      user,
      password,
      port,
      sid,
      connector: databaseType,
      uid: authUser.uid,
    };

    serverConnect(databaseType, data, firebase)
      .then((res) => {
        setLoading(false);
        if (res.status === 'CONNECTED') {
          handleClose();
        } else if (res.status === 'ERROR') {
          setLoading(false);
          setError('Unable to connect');
        }
      });
  };

  const isInvalid = host === '' || port === '' || sid === '' || user === '' || password === '';

  return (
    <form className="modal-form">
      <div className="importdatabase-inputs">
        <div className="importdatabase-inputs-host">
          <input
            placeholder="localhost"
            type="text"
            name="host"
            onChange={handleHost}
          />
        </div>
        <div className="importdatabase-inputs-port">
          <input
            placeholder="1433"
            type="text"
            name="port"
            onChange={handlePort}
          />
        </div>
        <br />
        <div className="importdatabase-inputs-login">
          <input
            placeholder="Oracle system identifier (SID)"
            type="text"
            name="sid"
            onChange={handleSid}
          />
        </div>
        <br />
        <div className="importdatabase-inputs-login">
          <input
            placeholder="username"
            type="text"
            name="user"
            onChange={handleUser}
          />
        </div>
        <br />
        <div className="importdatabase-inputs-login">
          <input
            placeholder="password"
            type="password"
            name="password"
            onChange={handlePassword}
          />
        </div>
        <div className="importdatabase-textbox">
          {error && <p>{error}</p>}
        </div>
        <p>
          Tart requires credentials to RUN your worksheet. Passwords are encrypted.
          Users have strict read access (Unable to edit, download, delete data within a database).
        </p>
        <br />
        {loading
				  ? 	(
  <div className="modal-button">
    <Icon path={mdiLoading} size={1.5} spin />
  </div>
          )
				  : 	(
  <input
    disabled={isInvalid}
    className="modal-button"
    type="button"
    value="Connect"
    onClick={handleConnect}
    style={{ color: isInvalid ? 'rgb(0, 0, 0, 0.5)' : color[authUser.uid] }}
  />
          )}
        <input
          className="modal-button"
          type="button"
          value="Cancel"
          onClick={handleClose}
        />
      </div>
    </form>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(ImportDatabase);
