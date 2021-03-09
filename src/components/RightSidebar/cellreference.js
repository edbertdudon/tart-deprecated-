import React, { useState, useRef } from 'react';
import { useOutsideAlerter } from '../../functions';

const CellReference = ({
  cell, part, placeholder, onValidate, onSetCell, onSetError,
}) => {
  const [hover, setHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const cellRef = useRef(null);

  const handleChange = (e) => onSetCell(e.target.value);

  const validate = () => {
    if (cell.length > 0) {
      onSetError(onValidate(cell));
    }
  };

  useOutsideAlerter(cellRef, validate);

  const handleHover = () => setHover(!hover)

  const handleEdit = () => setEdit(!edit);

  return (
    <div className={`rightsidebar-inputcontainer-${part}`} onMouseEnter={handleHover} onMouseLeave={handleHover}>
      <input
        type="text"
        className={`rightsidebar-input-${part}`}
        onChange={handleChange}
        value={cell}
        placeholder={placeholder}
        ref={cellRef}
      />
      {(hover || edit) && (
        <button
          type="button"
          className={`rightsidebar-dropdown-cellreference-${part}`}
          onClick={handleEdit}
        >
          {edit ? 'Done' : 'Edit'}
        </button>
      )}
    </div>
  );
};

export default CellReference;
