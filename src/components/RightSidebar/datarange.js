//
//  Data Range
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  LETTERS_REFERENCE, NUMBERS_REFERENCE, FORMULA_CELL_REFERENCES, RANGE_REFERENCES,
  VALID_FORMULA_CELL_REFERENCES, VALID_RANGE_REFERENCES, useOutsideAlerter,
  letterToColumn, columnToLetter, asCell, getRange,
} from '../../functions';

function getRangeIndex(range) {
  let mn = range.match(NUMBERS_REFERENCE);
  let ml = range.match(LETTERS_REFERENCE);

  if (mn === null || ml === null) {
    return null;
  }

  mn = mn.map((ref) => parseInt(ref) - 1);
  ml = ml.map((ref) => letterToColumn(ref) - 1);

  return {
    sri: mn[0],
    sci: ml[0],
    eri: mn[1] || mn[0],
    eci: ml[1] || ml[0],
  };
}

function getRownames(rows, range) {
  if (!(range.sri in rows)) {
    return [];
  }

  const { cells } = rows[range.sri];
  const cols = Object.keys(cells)
    .filter((t) => t < range.sci || t > range.eci);

  cols.forEach((t) => delete cells[t]);

  return Object.values(cells)
    .map((cell) => cell.text);
}

function getCols(rows, range) {
  if (!(range.sri in rows)) {
    return [];
  }
  return Object.keys(rows[range.sri].cells)
    .filter((t) => t >= range.sci && t <= range.eci)
    .map((t) => columnToLetter(parseInt(t) + 1));
}

function getVarsAsColumns(rows, len, range) {
  const { sri, eri } = range;
  const cols = getCols(rows, range);
  if (len === eri + 1) {
    return cols.map((col) => `${col}:${col}`);
  }
  return cols.map((col) => `${col + (sri + 1)}:${col + (eri + 1)}`);
}

function validateCellorRange(v) {
  if (!(VALID_FORMULA_CELL_REFERENCES.test(v) || VALID_RANGE_REFERENCES.test(v))) {
    return ('Invalid cell reference.');
  }
  const mc = v.match(FORMULA_CELL_REFERENCES);
  if (mc === null) {
    return ('Invalid cell.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
    if (ml[1] < ml[0] || ml.length > 2) {
      return ('Invalid range.');
    }
    const mn = v.match(NUMBERS_REFERENCE);
    if (mn !== null) {
      mn.map((ref) => parseInt(ref));
      if (mn[1] < mn[0] || mn.length > 2) {
        return ('Invalid range.');
      }
    }
  }
  return (null);
}

const DataRange = ({
  slides, formula, range, firstRow, datarange, setVariables, setDatarange, error, setError,
}) => {
  const [hover, setHover] = useState(false);
  const [edit, setEdit] = useState(false);
  const datarangeRef = useRef(null);

  useEffect(() => {
    if (edit) {
      setDatarange(asCell(formula.ri, formula.ci));
    }
  }, [formula]);

  useEffect(() => {
    if (edit) {
      setDatarange(getRange(range, slides.data.rows.len));
    }
  }, [range])

  const handleRange = () => {
    if (datarange.length > 0) {
      setError(validateCellorRange(datarange));
    }

    if (datarangeRef.current === document.activeElement) {
      const { rows } = slides.data;
      const range = getRangeIndex(datarange);

      if (!range) {
        return;
      }

      // Flipped compared to Statistics/Chart because firstrow changes
      if (firstRow) {
        setVariables(getRownames(rows._, range));
      } else {
        setVariables(getVarsAsColumns(rows._, rows.len, range));
      }
    }
  };

  useOutsideAlerter(datarangeRef, handleRange);

  const handleHover = () => setHover(!hover)

  const handleChange = (e) => setDatarange(e.target.value);

  const handleEdit = () => setEdit(!edit);

  return (
    <>
      <div className="rightsidebar-label">Data Range</div>
      <div className="rightsidebar-inputcontainer-1part1" onMouseEnter={handleHover} onMouseLeave={handleHover}>
        <input
          type="text"
          className="rightsidebar-input-1part1"
          onChange={handleChange}
          value={datarange}
          placeholder="A1:A2"
          ref={datarangeRef}
        />
        {(hover || edit) && (
          <button
            type="button"
            className="rightsidebar-dropdown-cellreference-1part1"
            onClick={handleEdit}
          >
            {edit ? 'Done' : 'Edit'}
          </button>
        )}
      </div>
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
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
)(DataRange);

export {
  getRangeIndex,
  getRownames,
  getCols,
  getVarsAsColumns,
  // setVariablesRange,
};
