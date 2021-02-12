export default function serverConnect(firebase, connector, data) {
  switch (connector) {
    case 'MySQL':
      return firebase.doConnect('connectMySql', data);
      break;
    case 'Microsoft SQL Server':
      return firebase.doConnect('connectMsSql', data);
      break;
    case 'Oracle SQL':
      return firebase.doConnect('connectOracledb', data);
      break;
  }
}
