//
//  ConfidenceInterval
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Form, { createStatistic } from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Formula from '../core/formula';
import Number from '../../RightSidebar/number';

const ConfidenceInterval = ({
  slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic,
}) => {
  const [variables, setVariables] = useState([]);
  const [formula, setFormula] = useState('');
  const [confLevel, setConfLevel] = useState(0.95);
  const [error, setError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);
  const [confLevelError, setConfLevelError] = useState(null);

  const handleFormula = (e) => setFormula(e);

  const handleConfLevel = (e) => {
    const input = e.target.value;
    setConfLevel(input);
    if (isNaN(parseFloat(input))) {
      setConfLevelError('Confidence level must be a number.');
    } else if (parseFloat(input) > 1 || parseFloat(input) < 0) {
      setConfLevelError('Confidence Level must be between 0 and 1.');
    } else {
      setConfLevelError(null);
    }
  };

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      formula,
    };
    if (confLevel !== 0.95) formuladata.confidencelevel = confLevel;
    doRegress(formuladata, statistics.find((e) => e.key === statistic).function).then((res) => {
      createStatistic(
        res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar,
      );
    }).catch((err) => setError(err.toString()));
  };

  const isInvalid = formulaError !== null
    || confLevelError !== null;

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Formula formulaText={formula} variables={variables} onSetFormula={handleFormula} formulaError={formulaError} />
      <Number label="Confidence level" value={confLevel} onChange={handleConfLevel} error={confLevelError} />
    </Form>
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ConfidenceInterval);
