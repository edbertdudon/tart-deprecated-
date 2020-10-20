export const databaseList = (connector, data, firebase) => {
	switch (connector) {
		case 'MySQL':
			return firebase.doListDatabases(data, 'listDatabasesMySql')
			break
		case 'Microsoft SQL Server':
			return firebase.doListDatabases(data, 'listDatabasesMsSql')
			break
	}
}
