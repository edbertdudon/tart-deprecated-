import React from 'react';
import withModal from '../Modal';

const Message = ({ text, onSelect }) => (
  <form className="modal-form-editableinput">
    <p>{`The name ${text} is already taken.`}</p>
    <button className="modal-button" onClick={onSelect}>Ok</button>
  </form>
);

export default withModal(Message);
