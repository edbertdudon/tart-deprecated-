//
//  OneWayManova
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
import Matrix from '../core/matrix';

const OneWayManova = ({
  slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic,
}) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [varsy, setVarsy] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setVarsy(varsy.filter((v) => variables.includes(variables[v])));
  }, [variables]);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      variablesy: JSON.stringify(varsy.map((v) => variables[v])),
    };
    doRegress(formuladata, statistics.find((e) => e.key === statistic).function).then((res) => {
      createStatistic(
        res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar,
      );
    }).catch((err) => setError(err.toString()));
  };

  const isInvalid = variableX == null
    || varsy.length < 1;

  return (
    <Form
      statistic={statistic}
      invalidStat={false}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Variable label="X (independent) variable" setSelected={setVariableX} options={variables} name={variables[variableX]} />
      <Matrix variables={variables} selected={varsy} setSelected={setVarsy} text="Y (dependent) variables" />
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
)(OneWayManova);
