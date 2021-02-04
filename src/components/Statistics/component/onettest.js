//
//  OneSampleTTest
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import Form, { ALTERNATIVES } from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Variable from '../core/variable';
import Alternative from '../core/alternative';
import Number from '../../RightSidebar/number';

const OneSampleTTest = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [alt, setAlt] = useState(0);
  const [mean, setMean] = useState(0);
  const [confLevel, setConfLevel] = useState(0.95);
  const [error, setError] = useState(null);
  const [meanError, setMeanError] = useState(null);
  const [confLevelError, setConfLevelError] = useState(null);

  const handleMean = (e) => {
    const input = e.target.value;
    setMean(input);
    if (isNaN(parseFloat(input))) {
      setMeanError('True mean must be a number.');
    } else {
      setMeanError(null);
    }
  };

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
    };
    if (alt !== 0) formuladata.alternative = ALTERNATIVES[alt].charAt(0).toLowerCase();
    if (mean !== 0) formuladata.mean = mean;
    if (confLevel !== 0.95) formuladata.confidencelevel = confLevel;
    return doRegress(formuladata, statistics.find((e) => e.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch((err) => setError(err.toString()));
  };

  const isInvalid = variableX == null
    || meanError !== null
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
      <Alternative setAlt={setAlt} alt={alt} />
      <Number label="True value of the mean (difference in means)" value={mean} onChange={handleMean} error={meanError} />
      <Number label="Confidence level" value={confLevel} onChange={handleConfLevel} error={confLevelError} />
    </Form>
  );
};

export default OneSampleTTest;
