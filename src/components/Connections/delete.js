import React from 'react';
import withModal from '../Modal';

const Delete = ({
  name, color, onClose, onSelect,
}) => (
  <form className="modal-form-datatrash">
    <h3>{`Are you sure you want to delete "${name}"?`}</h3>
    <p>This connection will be deleted immediately. You cannot undo this action.</p>
    <input
      className="modal-button"
      type="button"
      value="Cancel"
      onClick={onClose}
      style={{ color }}
    />
    <input
      className="modal-button"
      type="button"
      value="Delete"
      onClick={onSelect}
    />
  </form>
);

export default withModal(Delete);
