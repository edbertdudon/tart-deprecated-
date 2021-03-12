//
//  GeneralLinearRegression
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
import Variable from '../../RightSidebar/variable';

const FAMILY_LINKS = {
  gaussian: ['identity', 'log', 'inverse'],
  binomial: ['logit', 'probit', 'cloglog'], // 'cauchit', 'log',
  gamma: ['inverse', 'identity', 'log'],
  poisson: ['log', 'identity', 'sqrt'],
  // 'inverse.gaussian': ['1/mu^2', 'inverse', 'identity', 'log'],
  // quasi: ['logit', 'probit', 'cloglog', 'identity', 'inverse', 'log', '1/mu^2', 'sqrt'],
  // quasibinomial: ['logit', 'probit', 'cauchit', 'log', 'cloglog'],
  // quasipoisson: ['log', 'identity', 'sqrt'],
};

const GeneralLinearRegression = ({ statistic, family }) => {
  const [variables, setVariables] = useState([]);
  const [formula, setFormula] = useState('');
  const [link, setLink] = useState(0);
  const [error, setError] = useState(null);
  const [formulaError, setFormulaError] = useState(null);

  const handleFormula = (e) => setFormula(e);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      formula,
      link,
    };
    if (link !== 0) formuladata.link = link;
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
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
      <Formula
        formulaText={formula}
        variables={variables}
        onSetFormula={handleFormula}
        formulaError={formulaError}
      />
      <Variable label="Link" setSelected={setLink} options={FAMILY_LINKS[family]} name={FAMILY_LINKS[family][link]} />
    </Form>
  );
};

export default GeneralLinearRegression;
