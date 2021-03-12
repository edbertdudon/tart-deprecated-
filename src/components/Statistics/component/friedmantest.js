//
//  FriedmanTest
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

const FriedmanTest = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [variableX, setVariableX] = useState(null);
  const [groups, setGroups] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablex: variables[variableX],
      groups: variables[groups],
      blocks: variables[blocks],
    };
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)

      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
  };

  const isInvalid = variableX == null
    || groups == null
    || blocks == null;

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
      <Variable label="Blocking variable" setSelected={setBlocks} options={variables} name={variables[blocks]} />
    </Form>
  );
};

export default FriedmanTest;
