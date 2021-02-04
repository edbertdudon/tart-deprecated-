//
//  AkaikeInformationCriterion
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import Form from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Formula from '../core/formula';
import Number from '../../RightSidebar/number';

const AkaikeInformationCriterion = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [formula, setFormula] = useState('');
  const [penalty, setPenalty] = useState(2);
  const [error, setError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);
  const [penaltyError, setPenaltyError] = useState(null);

  const handleFormula = (e) => setFormula(e);

  const handlePenalty = (e) => {
    const input = e.target.value;
    setPenalty(input);
    if (isNaN(parseFloat(input))) {
      setPenaltyError('Penalty must be a number.');
    } else {
      setPenaltyError(null);
    }
  };

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      formula,
    };
    if (penalty !== 0.95) formuladata.penalty = penalty;
    return doRegress(formuladata, statistics.find((e) => e.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch((err) => setError(err.toString()));
  };

  const isInvalid = formulaError !== null
    || penaltyError !== null;

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
      <Number label="Penalty" value={penalty} onChange={handlePenalty} error={penaltyError} />
    </Form>
  );
};

export default AkaikeInformationCriterion;
