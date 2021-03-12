//
//  DurbinWatsonTest
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState } from 'react';
import Form, { BOOTSTRAP_METHOD } from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Formula from '../core/formula';
import BootstrapMethod from '../core/bootstrap';
import Alternative from '../core/alternative';
import Number from '../../RightSidebar/number';

const DurbinWatsonTest = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [formula, setFormula] = useState('');
  const [lag, setLag] = useState(1);
  const [method, setMethod] = useState(0);
  const [alt, setAlt] = useState(0);
  const [error, setError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);
  const [lagError, setLagError] = useState(null);

  const handleFormula = (e) => setFormula(e);

  const handleLag = (e) => {
    const input = e.target.value;
    setLag(input);
    if (Number.isNaN(parseFloat(input))) {
      setLagError('Lag must be a number.');
    } else if (parseFloat(input) < 0) {
      setLagError('Lag must be greater than 0.');
    } else {
      setLagError(null);
    }
  };

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      formula,
    };
    if (lag !== 1) formuladata.lag = lag;
    if (method !== 0) formuladata.method = BOOTSTRAP_METHOD[method].charAt(0).toLowerCase();
    if (alt !== 0 && lag === 1) {
      if (alt === 1) {
        formuladata.alternative = 'p';
      } else if (alt === 2) {
        formuladata.alternative = 'n';
      }
    }
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)

      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
  };

  const isInvalid = formulaError !== null
    || lagError !== null;

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
      <Number label="Maximum Lag" value={lag} onChange={handleLag} error={lagError} />
      <BootstrapMethod setMethod={setMethod} method={method} />
      {lag === 1 && <Alternative setAlt={setAlt} alt={alt} />}
    </Form>
  );
};

export default DurbinWatsonTest;
