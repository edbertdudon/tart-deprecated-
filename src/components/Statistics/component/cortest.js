//
//  CorrelationSignificance
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import Form, { CORRELATION_METHOD, ALTERNATIVES } from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Variable from '../core/variable';
import Alternative from '../core/alternative';
import Number from '../../RightSidebar/number';
import AlternativeMethod from '../core/alternativecorrelation';

const CorrelationSignificance = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [variableY, setVariableY] = useState(null);
  const [alt, setAlt] = useState(0);
  const [method, setMethod] = useState(0);
  const [confLevel, setConfLevel] = useState(0.95);
  const [error, setError] = useState(null);
  const [confLevelError, setConfLevelError] = useState(null);

  const handleMethod = (i) => setMethod(i);

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
      variablex: variables[variableX],
      variabley: variables[variableY],
    };
    if (alt !== 0) formuladata.alternative = ALTERNATIVES[alt].charAt(0).toLowerCase();
    if (method !== 0) formuladata.method = CORRELATION_METHOD[method].charAt(0).toLowerCase();
    if (confLevel !== 0.95) formuladata.confidencelevel = confLevel;
    return doRegress(formuladata, statistics.find((e) => e.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch((err) => setError(err.toString()));
  };

  const isInvalid = variableX == null
    || variableY == null
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
      <Variable label="X variable" setSelected={setVariableX} options={variables} name={variables[variableX]} />
      <Variable label="Y variable" setSelected={setVariableY} options={variables} name={variables[variableY]} />
      <Alternative setAlt={setAlt} alt={alt} />
      <AlternativeMethod onSetAlt={handleMethod} options={CORRELATION_METHOD} alt={method} />
      <Number label="Confidence level" value={confLevel} onChange={handleConfLevel} error={confLevelError} />
    </Form>
  );
};

export default CorrelationSignificance;
