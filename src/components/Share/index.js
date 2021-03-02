import React, { useState, useRef } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import withModal from '../Modal';
import { OFF_COLOR } from '../../constants/off-color';
import { withFirebase } from '../Firebase';
import './index.less';

const Share = ({
  firebase, authUser, color, worksheetname, onClose,
}) => {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [focusedEmail, setFocusedEmail] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => setEmail(e.target.value);

  const handleShare = () => {
    firebase.doShareFile(authUser.uid, worksheetname, emails);
  };

  const isValidEmail = () => {
    if (email.includes('@')) {
      emails.push(email);
      setEmail('');
      setFocusedEmail(null);
    }
  };

  const handleRemove = (i) => {
    if (i === null) {
      // inputRef.current.blur()
      setFocusedEmail(emails.length - 1);
    } else {
      const newEmails = [
        ...emails.slice(0, i),
        ...emails.slice(i + 1),
      ];
      setEmails(newEmails);
      if (i === emails.length - 1) {
        inputRef.current.focus();
        setFocusedEmail(null);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      isValidEmail();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.keyCode === 9) {
      isValidEmail();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.keyCode === 8 && email.length < 1 && emails.length > 0) {
      handleRemove(focusedEmail);
    } else if (e.keyCode === 37 && emails.length > 0) {
      if (focusedEmail === null) {
        // inputRef.current.blur()
        setFocusedEmail(emails.length - 1);
      } else if (focusedEmail > 0) {
        setFocusedEmail(focusedEmail - 1);
      }
    } else if (e.keyCode === 39 && emails.length > 0) {
      if (focusedEmail === emails.length - 1) {
        setFocusedEmail(null);
        // inputRef.current.focus()
      } else if (focusedEmail !== null) {
        setFocusedEmail(focusedEmail + 1);
      }
    }
  };

  const handleFocusInput = () => inputRef.current.focus();

  const handleSelect = (index) => setFocusedEmail(index);

  const isEmpty = emails.length < 1;

  return (
    <form className="modal-form">
      <h3>Share Worksheet</h3>
      <div className="share-input-emails" onClick={handleFocusInput}>
        {emails.map((em, index) => (
          <div
            className="share-email"
            style={{
              backgroundColor: focusedEmail === index && OFF_COLOR[color[authUser.uid]],
              color: focusedEmail === index && '#fff',
            }}
            onClick={() => handleSelect(index)}
          >
            {em}
            <Icon className="share-email-remove" onClick={() => handleRemove(index)} path={mdiClose} size={0.9} />
          </div>
        ))}
        <input
          name="email"
          value={email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type="email"
          placeholder={isEmpty && 'Email addresses'}
          className="share-button"
          ref={inputRef}
        />
      </div>
      <br />
      <input
        className="modal-button-left"
        type="button"
        value="Cancel"
        onClick={onClose}
      />
      <input
        disabled={isEmpty}
        className="modal-button-right"
        type="button"
        value="Share"
        onClick={handleShare}
        style={{ color: isEmpty ? 'rgb(0, 0, 0, 0.5)' : color[authUser.uid] }}
      />
    </form>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
});

export default compose(
  withModal,
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(Share);
