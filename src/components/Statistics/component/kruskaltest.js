//
//  KruskalTest
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

const KruskalTest = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      groups: variables[groups],
    };
    return doRegress(formuladata, statistics.find((e) => e.key === statistic).function)
      .then((res) => ({ res, formuladata }))
      .catch((err) => setError(err.toString()));
  };

  const isInvalid = variableX == null
    || group == null;

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
      <Variable label="Grouping variable" setSelected={setGroups} options={variables} name={variables[groups]} />
    </Form>
  );
};

export default KruskalTest;
