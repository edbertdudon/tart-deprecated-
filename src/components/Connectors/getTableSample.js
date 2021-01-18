export const getTableSample = (connector, data, firebase) => {
  switch (connector) {
    case 'MySQL':
      return firebase.doGetTableSample(data, 'getTableSampleMySql');
      break;
    case 'Microsoft SQL Server':
      return firebase.doGetTableSample(data, 'getTableSampleMsSql');
      break;
    case 'Oracle SQL':
      return firebase.doGetTableSample(data, 'getTableSampleOracledb');
      break;
  }
};
