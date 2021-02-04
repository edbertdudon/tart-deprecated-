//
//  LinearRegression
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

const LinearRegression = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [formula, setFormula] = useState('');
  const [error, setError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);

  const handleFormula = (e) => setFormula(e);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      formula,
    };
    return doRegress(formuladata, statistics.find((e) => e.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch((err) => setError(err.toString()));
  };

  const isInvalid = formulaError !== null;

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
    </Form>
  );
};

export default LinearRegression;
