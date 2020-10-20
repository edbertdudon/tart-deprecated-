export const tablesList = (connector, data, firebase) => {
	switch (connector) {
		case 'MySQL':
			return firebase.doListTables(data, 'listTablesMySql')
			break
		case 'Microsoft SQL Server':
			return firebase.doListTables(data, 'listTablesMsSql')
			break
		case 'Oracle SQL':
			return firebase.doListTables(data, 'listTablesOracledb')
			break
	}
}
