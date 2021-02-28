export default function serverConnect(firebase, connector, data) {
  switch (connector) {
    case 'MySQL': {
      return firebase.doConnect('connectMySql', data);
    }
    case 'Microsoft SQL Server': {
      return firebase.doConnect('connectMsSql', data);
    }
    case 'Oracle SQL': {
      return firebase.doConnect('connectOracledb', data);
    }
    default:
  }
  return null;
}
