//
//  StatisticDescription
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import Form from '../core/form';
import statistics from '../core/statisticsR';
import { doRegress } from '../../Spreadsheet/cloudr';

import Matrix from '../core/matrix';

const StatisticDescription = ({ statistic }) => {
  const [variables, setVariables] = useState([]);
  const [varsx, setVarsx] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setVarsx(varsx.filter((v) => variables.includes(variables[v])));
  }, [variables]);

  const handleSubmit = (e) => {
    const formuladata = {
      ...e,
      variablesx: JSON.stringify(varsx.map((v) => variables[v])),
    };
    return doRegress(formuladata, statistics.find((s) => s.key === statistic).function)

      .then((res) => ({ res, formuladata }))
      .catch(() => {
        setError('Unable to calculate statistic.');
        throw Error();
      });
  };

  const isInvalid = varsx.length < 1;

  return (
    <Form
      statistic={statistic}
      invalidStat={isInvalid}
      setVariables={setVariables}
      onSubmit={handleSubmit}
      error={error}
      setError={setError}
    >
      <Matrix variables={variables} selected={varsx} setSelected={setVarsx} text="X variables" />
    </Form>
  );
};

export default StatisticDescription;
