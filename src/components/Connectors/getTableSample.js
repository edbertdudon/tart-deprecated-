export default function getTableSample(firebase, connector, data) {
  switch (connector) {
    case 'MySQL': {
      return firebase.doGetTableSample('getTableSampleMySql', data);
    }
    case 'Microsoft SQL Server': {
      return firebase.doGetTableSample('getTableSampleMsSql', data);
    }
    case 'Oracle SQL': {
      return firebase.doGetTableSample('getTableSampleOracledb', data);
    }
    default:
  }
  return null;
}
