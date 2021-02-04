//
//  RobustOneWayManova
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import Form, { WILKS_METHOD, WILKS_APPROXIMATION } from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Variable from '../core/variable';
import Matrix from '../core/matrix';
import WilksMethod from '../core/wilksmethod';
import WilksApproximation from '../core/wilksapprox';

const RobustOneWayManova = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [varsy, setVarsy] = useState([]);
  const [method, setMethod] = useState(0);
  const [approximation, setApproximation] = useState(0);
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
    if (method !== 0) formuladata.method = WILKS_METHOD[method].charAt(0).toLowerCase();
    if (approximation !== 0) {
      if (approximation === 1) {
        formuladata.approximation = WilksApproximation[approximation].charAt(0);
      } else {
        formuladata.approximation = WilksApproximation[approximation].charAt(0).toLowerCase();
      }
    }
    return doRegress(formuladata, statistics.find((e) => e.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch((err) => setError(err.toString()));
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
      <WilksMethod setMethod={setMethod} method={method} />
      <WilksApproximation setMethod={setApproximation} method={approximation} />
    </Form>
  );
};

export default RobustOneWayManova;
