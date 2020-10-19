export const tablesList = (connector, data, firebase) => {
	switch (connector) {
		case 'MySQL':
			return firebase.doListTablesMySql(data)
			break
		case 'Microsoft SQL Server':
			return firebase.doListTablesMsSql(data)
			break
		case 'Oracle SQL':
			return firebase.doListTablesOracledb(data)
			break
	}
}
