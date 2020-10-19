export const getTableSample = (connector, data, firebase) => {
	switch (connector) {
		case 'MySQL':
			return firebase.doGetTableSampleFromMySql(data)
			break
		case 'Microsoft SQL Server':
			return firebase.doGetTableSampleFromMsSql(data)
			break
		case 'Oracle SQL':
			return firebase.doGetTableSampleFromOracledb(data)
			break
	}
}
