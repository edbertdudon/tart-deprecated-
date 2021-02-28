export default function tablesList(firebase, connector, data) {
  switch (connector) {
    case 'MySQL': {
      return firebase.doListTables('listTablesMySql', data);
    }
    case 'Microsoft SQL Server': {
      return firebase.doListTables('listTablesMsSql', data);
    }
    case 'Oracle SQL': {
      return firebase.doListTables('listTablesOracledb', data);
    }
    default:
  }
  return null;
}
