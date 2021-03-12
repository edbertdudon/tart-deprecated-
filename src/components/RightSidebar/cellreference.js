import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useOutsideAlerter, asCell, getRange } from '../../functions';

const CellReference = ({
  slides, formula, range, text, cell, placeholder, onValidate, onSetCell, onSetError,
}) => {
  const [hover, setHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const cellRef = useRef(null);

  useEffect(() => {
    if (edit) {
      onSetCell(asCell(formula.ri, formula.ci));
    }
  }, [formula]);

  useEffect(() => {
    if (edit) {
      onSetCell(getRange(range, slides.data.rows.len));
    }
  }, [range]);

  const handleChange = (e) => onSetCell(e.target.value);

  const validate = () => {
    if (cell.length > 0) {
      onSetError(onValidate(cell));
    }
  };

  useOutsideAlerter(cellRef, validate);

  const handleHover = () => setHover(!hover);

  const handleEdit = () => setEdit(!edit);

  return (
    <div className="rightsidebar-input-container" onMouseEnter={handleHover} onMouseLeave={handleHover}>
      <div className="rightsidebar-input-text">{text}</div>
      <input
        type="text"
        className="rightsidebar-input-cellreference"
        onChange={handleChange}
        value={cell}
        placeholder={placeholder}
        ref={cellRef}
      />
      {(hover || edit) && (
        <button
          type="button"
          className="rightsidebar-dropdown-cellreference"
          onClick={handleEdit}
        >
          {edit ? 'Done' : 'Edit'}
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
  formula: (state.formulaState.formula || { text: '', ri: 0, ci: 0 }),
  range: (state.rangeState.range || {}),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(CellReference);
