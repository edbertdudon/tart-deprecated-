export default function getTableSample(firebase, connector, data) {
  switch (connector) {
    case 'MySQL':
      return firebase.doGetTableSample('getTableSampleMySql', data);
      break;
    case 'Microsoft SQL Server':
      return firebase.doGetTableSample('getTableSampleMsSql', data);
      break;
    case 'Oracle SQL':
      return firebase.doGetTableSample('getTableSampleOracledb', data);
      break;
  }
}
