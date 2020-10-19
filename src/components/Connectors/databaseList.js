export const databaseList = (connector, data, firebase) => {
	switch (connector) {
		case 'MySQL':
			return firebase.doListDatabasesMySql(data)
			break
		case 'Microsoft SQL Server':
			return firebase.doListDatabasesMsSql(data)
			break
	}
}
