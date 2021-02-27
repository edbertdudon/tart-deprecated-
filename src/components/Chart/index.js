//
//  Chart
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import charts from './chartsR';
import DataRange, {
  getRangeIndex, getRownames, getVarsAsColumns,
} from '../RightSidebar/datarange';
import Button from '../RightSidebar/button';
import { NUMBERS_REFERENCE, createFile } from '../../functions';
import withLists from '../RightSidebar/withLists';
import withListsDropdown from '../RightSidebar/withListsDropdown';
import { withFirebase } from '../Firebase';

const Chart = ({
  firebase, authUser, worksheetname, slides, chartSelect, onSetSaving,
}) => {
  const [variables, setVariables] = useState([]);
  const [datarange, setDatarange] = useState('');
  const [firstRow, setFirstRow] = useState(true);
  const [types, setTypes] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [variableY, setVariableY] = useState(null);
  const [sparkuri, setSparkuri] = useState('');
  const [message, setMessage] = useState(null);
  const [datarangeError, setDatarangeError] = useState(null);

  useEffect(() => {
    const { rows } = slides.data;
    if (chartSelect === null) {
      setVariables([]);
      setDatarange('');
      setFirstRow(true);
      setTypes([]);
      setVariableX(null);
      setVariableY(null);
      setSparkuri('');
      setMessage(null);
      setDatarangeError(null);
    } else {
      const range = getRangeIndex(chartSelect.range);
      const rowNames = getRownames(rows._, range);
      if (rowNames.some(Number.isNaN)) {
        setVariables(rowNames);
      } else {
        setVariables(
          getVarsAsColumns(rows._, rows.len, range),
        );
      }

      setDatarange(chartSelect.range);
      setFirstRow(chartSelect.firstrow);
      setTypes(chartSelect.types);
      setVariableX(chartSelect.variablex);
      setVariableY(chartSelect.variabley);
      setSparkuri(chartSelect.sparkuri);
    }
  }, [chartSelect]);

  function save() {
    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  }

  const handleUpdateChart = (selected) => {
    setTypes(selected);
    const c = slides.data.chartSelect;
    c.types = selected;
    slides.editChart(c);
    save();
  };

  const handleUpdateVariableX = (option) => {
    setVariableX(option);
    const c = slides.data.chartSelect;
    c.variablex = option;
    slides.editChart(c);
    save();
  };

  const handleUpdateVariableY = (option) => {
    setVariableY(option);
    const c = slides.data.chartSelect;
    c.variabley = option;
    slides.editChart(c);
    save();
  };

  const handleAddChart = (option) => {
    const newTypes = [...types, option];
    setTypes(newTypes);
    const c = slides.data.chartSelect;
    c.types = newTypes;
    slides.editChart(c);
    save();
  };

  const handleFirstrow = () => {
    const { data } = slides;
    const { type, rows } = data;
    if (type !== 'input') {
      const range = getRangeIndex(datarange);
      setFirstRow(!firstRow);
      if (!firstRow) {
        setVariables(
          getRownames(rows._, range),
        );
      } else {
        setVariables(
          getVarsAsColumns(rows._, rows.len, range),
        );
      }
      const c = data.chartSelect;
      c.firstrow = !firstRow;
      slides.editChart(c);
      save();
    }
    // input must have firstrow = true for sparkR to work
    if (type === 'input' && datarange.match(NUMBERS_REFERENCE) === null) {
      setMessage('First row must be true for calculating statistics on population data.');
    }
  };

  function filterVariables(item, index) {
    return charts[types[0]].variables === item.variables && !types.includes(index);
  }

  return (
    <>
      {types.length < 1
        ? <div className="rightsidebar-none">No chart selected</div>
        : sparkuri.length > 0
          ? <div className="rightsidebar-none">Cannot edit chart plotted in 'Run'</div>
          : (
            <>
              <div className="rightsidebar-label">Chart Type</div>
              {types.map((selected, index) => (
                <ChartsWithListsDropdown
                  onChange={handleUpdateChart}
                  options={charts.filter((item, index) => filterVariables(item, index))}
                  name={charts[selected].title}
                  selection={types}
                  setSelection={setTypes}
                  currentSelection={index}
                  key={index}
                />
              ))}
              <ChartsWithLists
                onChange={handleAddChart}
                options={charts.filter((item, index) => filterVariables(item, index))}
                name="Add Additonal Chart"
                styles={{ color: '#aaa' }}
              />
              <DataRange
                firstRow={firstRow}
                datarange={datarange}
                setVariables={setVariables}
                setDatarange={setDatarange}
                error={datarangeError}
                setError={setDatarangeError}
              />
              <div className="rightsidebar-label">X-Axis</div>
              <OptionsWithLists
                onChange={handleUpdateVariableX}
                options={variables}
                name={variables[variableX]}
              />
              {(charts[types[0]].variables > 1)
                && (
                <>
                  <div className="rightsidebar-label">Y-Axis</div>
                  <OptionsWithLists
                    onChange={handleUpdateVariableY}
                    options={variables}
                    name={variables[variableY]}
                  />
                </>
                )}
              <Button onClick={handleFirstrow} condition={firstRow} text="First row as header" />
              <div className="rightsidebar-text">
                {message && <div className="rightsidebar-error">{message}</div>}
              </div>
            </>
          )}
    </>
  );
};

const Charts = ({ option }) => option.key;
const Options = ({ option }) => option;

const ChartsWithListsDropdown = withListsDropdown(Charts);
const ChartsWithLists = withLists(Charts);
const OptionsWithLists = withLists(Options);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  saving: (state.savingState.saving || false),
  chartSelect: (state.chartSelectState.chartSelect || null),
});

const mapDispatchToProps = (dispatch) => ({
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Chart);
