//
//  TwoWayAov
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import Form from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Variable from '../core/variable';

const TwoWayAov = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableY, setVariableY] = useState(null);
  const [variableX1, setVariableX1] = useState(null);
  const [variableX2, setVariableX2] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variabley: variables[variableY],
      variablex1: variables[variableX1],
      variablex2: variables[variableX2],
    };
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)

      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
  };

  const isInvalid = variableY == null
    || variableX1 == null
    || variableX2 == null;

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Variable label="Y (dependent) variable" setSelected={setVariableY} options={variables} name={variables[variableY]} />
      <Variable label="X (independent) variable 1" setSelected={setVariableX1} options={variables} name={variables[variableX1]} />
      <Variable label="X (independent) variable 2" setSelected={setVariableX2} options={variables} name={variables[variableX2]} />
    </Form>
  );
};

export default TwoWayAov;
