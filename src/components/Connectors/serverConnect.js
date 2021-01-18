export const serverConnect = (connector, data, firebase) => {
  switch (connector) {
    case 'MySQL':
      return firebase.doConnect(data, 'connectMySql');
      break;
    case 'Microsoft SQL Server':
      return firebase.doConnect(data, 'connectMsSql');
      break;
    case 'Oracle SQL':
      return firebase.doConnect(data, 'connectOracledb');
      break;
  }
};
