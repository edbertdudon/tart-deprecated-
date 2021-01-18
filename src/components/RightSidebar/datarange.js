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
import { useOutsideAlerter } from '../../functions';
import { letterToColumn, columnToLetter } from '../Spreadsheet/cloudr';

const LETTERS_REFERENCE = /\$?[A-Z]+/g;

export const getRownames = (data) => Object.values(data.rows._[0].cells).map((cell) => cell.text);

export const getCols = (rownames) => rownames.map((t, i) => columnToLetter(i + 1));

export const getVars = (data, cols) => {
  const rows = Object.keys(data.rows._).map((row) => parseInt(row) + 1);
  return cols.map((col) => `${col + rows[0]}:${col}${rows[rows.length - 1]}`);
};

export const setVariablesRange = (data, firstRow, datarange, setVariables) => {
  if ((data.type === 'sheet' || data.type === 'input') && '0' in data.rows._) {
    const rownames = getRownames(data);
    const cols = getCols(rownames);
    const ml = datarange.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
    if (firstRow) {
      setVariables(rownames.slice(ml[0], ml[1] + 1));
    } else {
      setVariables(
        getVars(data, cols).slice(ml[0], ml[1] + 1),
      );
    }
  }
};

const DataRange = ({
  slides, firstRow, datarange, setVariables, setDatarange, error, setError,
}) => {
  const datarangeRef = useRef(null);

  const handleSetVariablesRange = () => setVariablesRange(slides.data, firstRow, datarange, setVariables);

  useOutsideAlerter(datarangeRef, handleSetVariablesRange);

  const handleUpdateDatarange = (e) => updateCellorRange(e, setDatarange, setError);

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
