export default function databaseList(firebase, connector, data) {
  switch (connector) {
    case 'MySQL':
      return firebase.doListDatabases('listDatabasesMySql', data);
      break;
    case 'Microsoft SQL Server':
      return firebase.doListDatabases('listDatabasesMsSql', data);
      break;
  }
}
