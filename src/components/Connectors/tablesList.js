export default function tablesList(firebase, connector, data) {
  switch (connector) {
    case 'MySQL':
      return firebase.doListTables('listTablesMySql', data);
      break;
    case 'Microsoft SQL Server':
      return firebase.doListTables('listTablesMsSql', data);
      break;
    case 'Oracle SQL':
      return firebase.doListTables('listTablesOracledb', data);
      break;
  }
}
