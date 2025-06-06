//
//  Form
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import statistics from './statisticsR';
import { translateR, spreadsheetToR } from '../../Spreadsheet/cloudr';
import DataRange, {
  getRangeIndex, getRownames, getVarsAsColumns,
} from '../../RightSidebar/datarange';
import Checkbox from '../../RightSidebar/checkbox';
import { createFile, getRange } from '../../../functions';
import { withFirebase } from '../../Firebase';

export const ALTERNATIVES = ['Two-sided', 'Greater', 'Less'];
export const ALTERNATIVES_AUTOCORRELATION = ['Two-sided', 'Positive', 'Negative'];
// Kendall doesn't work with corrr::correlate
// export const CORRELATION_METHOD = ['Pearson', 'Spearman', 'Kendall'];
export const CORRELATION_METHOD = ['Pearson', 'Spearman'];
export const BOOTSTRAP_METHOD = ['Resample', 'Normal'];
export const WILKS_METHOD = ['c (standard)', 'MCD', 'Rank'];
export const WILKS_APPROXIMATION = ['Bartlett', 'Rao', 'Empirical'];

const Form = ({
  firebase, authUser, color, worksheetname, slides, current, statistic,
  invalidStat, error, children, setVariables, setError, onSubmit, onSetSaving,
  onSetDataNames, onSetCurrent, onSetRightSidebar,
}) => {
  const [datarange, setDatarange] = useState('');
  const [firstRow, setFirstRow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [datarangeError, setDatarangeError] = useState(null);

  useEffect(() => {
    const { data, sheet } = slides;
    const { type, rows } = data;
    const { range } = sheet.selector;
    const rowNames = getRownames(rows._, range);

    setDatarange(getRange(range, rows.len));

    if (type === 'sheet') {
      if (rowNames.some((n) => Number.isNaN(parseFloat(n)))) {
        setVariables(rowNames);
      } else {
        setVariables(getVarsAsColumns(rows._, rows.len, range));
        setFirstRow(false);
      }
    }
    if (slides.data.type === 'input') {
      setVariables(rowNames);
    }
  }, []);

  const handleClose = () => {
    onSetRightSidebar('none');
    setFirstRow(true);
    setMessage(null);
    setDatarangeError(null);
    setError(null);
    setLoading(false);
  };

  const handleFirstrow = () => {
    const { type, rows } = slides.data;

    if (type !== 'input') {
      const range = getRangeIndex(datarange, slides.data.rows.len);
      setFirstRow(!firstRow);

      // Flipped compared to datarange because firstrow changes
      if (firstRow) {
        setVariables(getVarsAsColumns(rows._, rows.len, range));
      } else {
        setVariables(getRownames(rows._, range));
      }
    } else {
      // input must have firstrow = true for sparkR to work
      setMessage('First row must be true for calculating statistics on inputs.');
    }
    // // input must have firstrow = true for sparkR to work
    // if (type === 'input' && datarange.match(NUMBERS_REFERENCE) === null) {
    //   setMessage('First row must be true for calculating statistics on population data.');
    // }
  };

  const handleSubmit = () => {
    setLoading(true);
    const { datas, data } = slides;
    onSubmit({
      slides: JSON.stringify(spreadsheetToR(datas)),
      names: JSON.stringify(datas.map((d) => d.name)),
      range: translateR(datarange, data.name),
      firstrow: firstRow,
    }).then((r) => {
      const { res, formuladata } = r;
      delete formuladata.slides;
      delete formuladata.names;

      const statObj = statistics.find((e) => e.key === statistic);
      res.type = statObj.function;
      res.regression = { ...formuladata, sample: true };

      const isEmpty = slides.insertData(current, res, statObj.title, 'read');
      onSetDataNames(slides.datas.map((it) => it.name));
      if (!isEmpty) {
        onSetCurrent(current + 1);
      }
      onSetRightSidebar('none');
      setLoading(false);

      onSetSaving(true);
      firebase.doUploadWorksheet(
        authUser.uid,
        worksheetname,
        createFile(slides, worksheetname),
      ).then(() => onSetSaving(false));
    }).catch(() => setLoading(false));
  };

  const isInvalid = invalidStat
    || datarangeError != null
    || error != null;

  return (
    <>
      <DataRange
        firstRow={firstRow}
        datarange={datarange}
        setVariables={setVariables}
        setDatarange={setDatarange}
        error={datarangeError}
        setError={setDatarangeError}
      />
      {children}
      <Checkbox onClick={handleFirstrow} condition={firstRow} text="First row as header" />
      <div className="rightsidebar-subtext">
        Population calculations require first row as header.
      </div>
      <div className="rightsidebar-text">
        {/* <p>{statistics.find((e) => e.key === statistic).description}</p> */}
        {message && <div className="rightsidebar-error">{message}</div>}
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
      {loading
        ? <div className="rightsidebar-loading"><Icon path={mdiLoading} size={1.5} spin /></div>
        : (
          <input
            disabled={isInvalid}
            type="submit"
            style={{ color: isInvalid ? 'rgb(0, 0, 0, 0.5)' : color[authUser.uid] }}
            onClick={handleSubmit}
            className="rightsidebar-submit"
          />
        )}
    </>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Form);
