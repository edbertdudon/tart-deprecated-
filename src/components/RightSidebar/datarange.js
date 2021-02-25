//
//  Data Range
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { letterToColumn, columnToLetter } from '../Spreadsheet/cloudr';
import {
  LETTERS_REFERENCE, NUMBERS_REFERENCE, FORMULA_CELL_REFERENCES, RANGE_REFERENCES,
  VALID_FORMULA_CELL_REFERENCES, VALID_RANGE_REFERENCES, useOutsideAlerter
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

function getRange(len, range) {
  const {
    sri, sci, eri, eci,
  } = range;

  const colStart = columnToLetter(sci + 1);
  if (sri === eri && sci === eci) {
    return `${colStart + (sri + 1)}`;
  }
  const colEnd = columnToLetter(eci + 1);
  if (len === eri + 1) {
    return (`${colStart}:${colEnd}`);
  }
  return (`${colStart + (sri + 1)}:${colEnd + (eri + 1)}`);
}

function getVarsAsColumns(rows, len, range) {
  const {
    sri, sci, eri, eci,
  } = range;
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

// function setVariablesRange(firstRow, rows, len, range) {
//   if (firstRow) {
//     return getRownames(rows, slides.sheet.selector.range);
//   }
//   return getVarsAsColumns(rows, len, range);
// }

const DataRange = ({
  slides, firstRow, datarange, setVariables, setDatarange, error, setError,
}) => {
  const datarangeRef = useRef(null);

  const handleRange = () => {
    if (datarange.length > 0) {
      setError(validateCellorRange(datarange));
    }

    if (datarangeRef.current === document.activeElement) {
      const { rows } = slides.data;
      const range = getRangeIndex(datarange);

      if (!range) {
        return
      }

      if (firstRow) {
        setVariables(getRownames(rows._, range));
      } else {
        setVariables(getVarsAsColumns(rows._, rows.len, range));
      }
    }
  };

  useOutsideAlerter(datarangeRef, handleRange);

  const handleChange = (e) => setDatarange(e.target.value);

  return (
    <>
      <div className="rightsidebar-label">Data Range</div>
      <input
        type="text"
        className="rightsidebar-input-1part1"
        onChange={handleChange}
        value={datarange}
        placeholder="A1:A2"
        ref={datarangeRef}
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
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
  getRange,
  getVarsAsColumns,
  // setVariablesRange,
};
