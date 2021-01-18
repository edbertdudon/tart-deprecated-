//
//  RepeatedMeasuresAnova
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

import Variable from '../core/variable';

const RepeatedMeasuresAnova = ({
  slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic,
}) => {
  const [variables, setVariables] = useState([]);
  const [variableX1, setVariableX1] = useState(null);
  const [variableX2, setVariableX2] = useState(null);
  const [variableY, setVariableY] = useState(null);
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablex1: variables[variableX1],
      variablex2: variables[variableX2],
      variabley: variables[variableY],
      subject: variables[subject],
    };
    doRegress(formuladata, statistics.find((e) => e.key === statistic).function).then((res) => {
      createStatistic(
        res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar,
      );
    }).catch((err) => setError(err.toString()));
  };

  const isInvalid = variableX1 == null
    || variableX2 == null
    || variableY == null
    || subject == null;

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Variable label="Y (dependent) variable" setSelected={setVariableY} options={variables} name={variables[variableY]} />
      <Variable label="Within-groups factor" setSelected={setVariableX1} options={variables} name={variables[variableX1]} />
      <Variable label="Between-groups factor" setSelected={setVariableX2} options={variables} name={variables[variableX2]} />
      <Variable label="Subject" setSelected={setSubject} options={variables} name={variables[subject]} />
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
)(RepeatedMeasuresAnova);
