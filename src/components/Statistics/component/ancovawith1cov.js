//
//  Ancova1Covariate
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState } from 'react';
import Form from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Variable from '../../RightSidebar/variable';

const Ancova1Covariate = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [variableY, setVariableY] = useState(null);
  const [covariate1, setCovariate1] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      variabley: variables[variableY],
      covariate1: variables[covariate1],
    };
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
  };

  const isInvalid = variableX == null
    || variableY == null
    || covariate1 == null;

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
      <Variable label="X (independent) variable" setSelected={setVariableX} options={variables} name={variables[variableX]} />
      <Variable label="Covariate" setSelected={setCovariate1} options={variables} name={variables[covariate1]} />
    </Form>
  );
};

export default Ancova1Covariate;
