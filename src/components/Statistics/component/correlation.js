//
//  Correlation
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Form, { CORRELATION_METHOD, createStatistic } from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Matrix from '../core/matrix';
import Alternative from '../core/alternativecorrelation';
import { getRownames, getVarsAsColumns } from '../../RightSidebar/datarange';

const Correlation = ({
  slides, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar, statistic,
}) => {
  const [variables, setVariables] = useState([]);
  const [varsx, setVarsx] = useState([]);
  const [method, setMethod] = useState(0);
  const [error, setError] = useState(null);
  const firstUpdate = useRef(true);

  useEffect(() => {
    const { data, sheet } = slides;
    const { type, rows } = data;
    const { range } = sheet.selector;

	  if (type === 'sheet' || type === 'input') {
      const rowNames = getRownames(rows._, range);
	    if (rowNames.some(isNaN)) {
	      setVarsx(
          rowNames.map((v, i) => i),
        );
	    } else {
	      setVarsx(
          getVarsAsColumns(rows._, rows.len, range)
            .map((v, i) => i),
        );
	    }
	  }
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setVarsx(varsx.filter((v) => variables.includes(variables[v])));
  }, [variables]);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablesx: JSON.stringify(varsx.map((v) => variables[v])),
    };
    if (method !== 0) formuladata.method = CORRELATION_METHOD[method].charAt(0).toLowerCase();
    doRegress(formuladata, statistics.find((e) => e.key === statistic).function).then((res) => {
      createStatistic(
        res, slides, formuladata, statistic, dataNames,
        current, onSetDataNames, onSetCurrent, onSetRightSidebar,
      );
    }).catch((err) => setError(err.toString()));
  };

  const isInvalid = varsx.length < 1;

  return (
    <Form
      statistic={statistic}
      invalidStat={false}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Matrix variables={variables} selected={varsx} setSelected={setVarsx} text="X variables" />
      <Alternative setAlt={setMethod} options={CORRELATION_METHOD} alt={method} />
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
)(Correlation);
