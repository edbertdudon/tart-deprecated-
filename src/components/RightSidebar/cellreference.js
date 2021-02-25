import React, { useRef } from 'react';
import { useOutsideAlerter } from '../../functions';

const CellReference = ({ cell, classname, placeholder, onValidate, onSetCell, onSetError }) => {
  const cellRef = useRef(null);

  const handleChange = (e) => onSetCell(e.target.value);

  const validate = () => {
    if (cell.length > 0) {
      onSetError(onValidate(cell));
    }
  };

  useOutsideAlerter(cellRef, validate);

  return (
    <input
      type="text"
      className={classname}
      onChange={handleChange}
      value={cell}
      placeholder={placeholder}
      ref={cellRef}
    />
  )
};

export default CellReference;
