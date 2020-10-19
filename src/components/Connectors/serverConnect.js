export const serverConnect = (connector, data, firebase) => {
	switch (connector) {
		case 'MySQL':
			return firebase.doConnectMySql(data)
			break
		case 'Microsoft SQL Server':
			return firebase.doConnectMsSql(data)
			break
		case 'Oracle SQL':
			return firebase.doConnectOracledb(data)
			break
	}
}
