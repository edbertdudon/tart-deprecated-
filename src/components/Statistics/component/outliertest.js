//
//  OutlierTest
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState } from 'react';
import Form from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Formula from '../core/formula';
import Number from '../../RightSidebar/number';

const OutlierTest = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [formula, setFormula] = useState('');
  const [pvalue, setPvalue] = useState(0.05);
  const [observations, setObservations] = useState(10);
  const [error, setError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);
  const [pvalueError, setPvalueError] = useState(null);
  const [observationsError, setObservationsError] = useState(null);

  const handleFormula = (e) => setFormula(e);

  const handlePvalue = (e) => {
    const input = e.target.value;
    setPvalue(input);
    if (Number.isNaN(parseFloat(input))) {
      setPvalueError('p-values level must be a number.');
    } else if (parseFloat(input) > 1 || parseFloat(input) < 0) {
      setPvalueError('p-values must be between 0 and 1.');
    } else {
      setPvalueError(null);
    }
  };

  const handleObservations = (e) => {
    const input = e.target.value;
    setObservations(input);
    if (Number.isNaN(parseFloat(input))) {
      setObservationsError('Maximum observations must be a number.');
    } else {
      setObservationsError(null);
    }
  };

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      formula,
    };
    if (pvalue !== 0.05) formuladata.pvalue = pvalue;
    if (observations !== 10) formuladata.observations = observations;
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)

      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
  };

  const isInvalid = formulaError !== null
    || pvalueError !== null
    || observationsError !== null;

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Formula
        formulaText={formula}
        variables={variables}
        onSetFormula={handleFormula}
        formulaError={formulaError}
      />
      <Number label="Significance Level" value={pvalue} onChange={handlePvalue} error={pvalueError} />
      <Number label="Observations" value={observations} onChange={handleObservations} error={observationsError} />
    </Form>
  );
};

export default OutlierTest;
