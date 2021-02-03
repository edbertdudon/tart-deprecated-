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
import { updateCellorRange } from '../Optimize';
import { LETTERS_REFERENCE, NUMBERS_REFERENCE, useOutsideAlerter } from '../../functions';
import { letterToColumn, columnToLetter } from '../Spreadsheet/cloudr';

function getRangeIndex(range) {
  const mn = range.match(NUMBERS_REFERENCE).map((ref) => parseInt(ref) - 1);
  const ml = range.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
  return {
    sri: mn[0],
    sci: ml[0],
    eri: mn[1],
    eci: ml[1],
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
    if (datarangeRef.current === document.activeElement) {
      const { rows } = slides.data;
      const range = getRangeIndex(datarange);

      if (firstRow) {
        setVariables(getRownames(rows._, range));
      } else {
        setVariables(getVarsAsColumns(rows._, rows.len, range));
      }
    }
  };

  useOutsideAlerter(datarangeRef, handleRange);

  const handleUpdateDatarange = (e) => {
    updateCellorRange(e, setDatarange, setError);
  };

  return (
    <>
      <div className="rightsidebar-label">Data Range</div>
      <input
        type="text"
        className="rightsidebar-input-1part1"
        onChange={handleUpdateDatarange}
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
