export default function databaseList(firebase, connector, data) {
  switch (connector) {
    case 'MySQL': {
      return firebase.doListDatabases('listDatabasesMySql', data);
    }
    case 'Microsoft SQL Server': {
      return firebase.doListDatabases('listDatabasesMsSql', data);
    }
    default:
  }
  return null;
}
