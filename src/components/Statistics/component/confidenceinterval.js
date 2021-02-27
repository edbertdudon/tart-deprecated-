//
//  ConfidenceInterval
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import Form from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Formula from '../core/formula';
import Number from '../../RightSidebar/number';

const ConfidenceInterval = ({ statistic }) => {
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
    if (Number.isNaN(parseFloat(input))) {
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
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)

      .then((res) => ({ res, formuladata }))
      .catch(() => {
  setError('Unable to calculate statistic.');
  throw Error();
});
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

export default ConfidenceInterval;
