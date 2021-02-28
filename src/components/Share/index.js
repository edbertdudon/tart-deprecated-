import React, { useState, useRef } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import './index.less';
import withModal from '../Modal';
import { withFirebase } from '../Firebase';

const Share = ({
  firebase, authUser, color, onClose, onSelect,
}) => {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [focusedEmail, setFocusedEmail] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => setEmail(e.target.value);

  const handleShare = () => {
    // firebase.doUploadFile(authUser.uid, file.name, file)
    onSelect();
  };

  const isValidEmail = () => {
    if (email.includes('@')) {
      emails.push(email);
      setEmail('');
      setFocusedEmail(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      isValidEmail();
      e.stopPropagation();
    } else if (e.keyCode === 9) {
      isValidEmail();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.keyCode === 8 && email.length < 1 && emails.length > 0) {
      if (focusedEmail === null) {
        // inputRef.current.blur()
        setFocusedEmail(emails.length - 1);
      } else {
        const newEmails = [
          ...emails.slice(0, focusedEmail),
          ...emails.slice(focusedEmail + 1),
        ];
        setEmails(newEmails);
        if (focusedEmail === emails.length - 1) {
          inputRef.current.focus();
          setFocusedEmail(null);
        }
      }
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

  return (
    <form className="modal-form">
      <h3>Share Worksheet</h3>
      <div className="share-input-emails" onClick={handleFocusInput}>
        {emails.map((em, index) => (
          <span
            className="share-email"
            style={{
						  backgroundColor: focusedEmail === index && 'rgb(18,106,255)',
						  color: focusedEmail === index && '#fff',
            }}
            onClick={() => handleSelect(index)}
          >
            {em}
          </span>
        ))}
        <input
          name="email"
          value={email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          type="email"
          placeholder={emails.length < 1 && 'Email addresses'}
          className="share-button"
          ref={inputRef}
        />
      </div>
      <br />
      <input
        className="modal-button"
        type="button"
        value="Cancel"
        onClick={onClose}
      />
      <input
        disabled={email === ''}
        className="modal-button"
        type="button"
        value="Share"
        onClick={handleShare}
        style={{ color: email === '' ? 'rgb(0, 0, 0, 0.5)' : color[authUser.uid] }}
      />
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
)(Share);
