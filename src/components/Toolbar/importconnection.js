import React, { useState, useEffect } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import Icon from '@mdi/react';
import { mdilChevronLeft, mdilChevronRight } from '@mdi/light-js'
import { mdiLoading } from '@mdi/js'

import { databaseList } from '../Connectors/databaseList'
import { tablesList } from '../Connectors/tablesList'
import { getTableSample } from '../Connectors/getTableSample'
// import { dispatchTableSample } from '../../../Connectors/dispatchTableSample'
import { withFirebase } from '../Firebase'

const LEVELS_STATES = [
	'connections', 'databases', 'tables'
]

const ImportConnection = ({ firebase, authUser, color, onClose, onSelect }) => {
	const [loading, setLoading] = useState(false)
	const [level, setLevel] = useState(0)
	const [connections, setConnections] = useState({})
	const [databases, setDatabases] = useState([])
	const [tables, setTables] = useState([])
	const [filteredOption, setFilteredOption] = useState([])
	const [config, setConfig] = useState({})
	const [error, setError] = useState(null)

	useEffect(() => {
		firebase.connection(authUser.uid).get()
			.then(doc => {
				if (doc.exists) {
					setConnections(doc.data())
					setFilteredOption(Object.keys(doc.data()))
				}
			})
	}, [])

	const handleClose = () => {
		onClose()
		setError(null)
		setLoading(false)
		setLevel(0)
	}

	const handleBack = () => {
		if (level > 0) {
			setLevel(level-1)
			setFilteredOption(handleSelectLibrary(level-1))
			setError(null)
			setLoading(false)
		}
	}

	const handleForward = () => {
		if (level < 2) {
			setLevel(level+1)
			setFilteredOption(handleSelectLibrary(level+1))
		}
	}

	const handleSearch = e => {
		setFilteredOption(
			handleSelectLibrary(level).filter(file =>
				file.toLowerCase().includes(e.target.value.toLowerCase())
			)
		)
	}

	const handleSelectLibrary = select => {
		let library
		switch (LEVELS_STATES[select]) {
			case 'connections':
				library = Object.keys(connections)
				break;
			case 'databases':
				library = databases
				break;
			case 'tables':
				library = tables
				break;
		}
		return library
	}

	const handleSelectConnection = connection => {
		setLoading(true)
		setConfig(connections[connection])
		if (connections[connection].connector === 'Oracle SQL') {
			setLevel(level+2)
			tablesList(connections[connection].connector, connections[connection], firebase)
				.then(res => {
					if ('status' in res) {
						if (res.status === 'ERROR') {
							setError('Unable to connect')
							setLoading(false)
							return
						}
					}
					setTables(res)
					setFilteredOption(res)
					setLoading(false)
				})
		} else {
			setLevel(level+1)
			databaseList(connections[connection].connector, connections[connection], firebase)
				.then(res => {
					if ('status' in res) {
						if (res.status === 'ERROR') {
							setError('Unable to connect')
							setLoading(false)
							return
						}
					}
					setDatabases(res)
					setFilteredOption(res)
					setLoading(false)
				})
		}
	}

	const handleSelectDatabase = database => {
		setLoading(true)
		setLevel(level+1)
		let data = {...config, database: database}
		setConfig(data)
		tablesList(config.connector, data, firebase)
			.then(res => {
				if ('status' in res) {
					if (res.status === 'ERROR') {
						setError('Unable to connect')
						setLoading(false)
						return
					}
				}
				setTables(res)
				setFilteredOption(res)
				setLoading(false)
			})
	}

	const handleSelectTable = table => {
		if (level === 2) {
			setLoading(true)
			let data = {...config, table: table}
			getTableSample(config.connector, data, firebase)
				.then(res => {
					if ('status' in res) {
						if (res.status === 'ERROR') {
							setError('Unable to connect')
							setLoading(false)
							return
						}
					}
					let connector = config.connector
					let host = config.host + "." + config.port

					// dispatchTableSample(
					// 	connector,
					// 	host,
					// 	config.database,
					// 	table,
					// 	res,
					// 	dispatchSlides,
					// 	setCurrentSlide,
					// 	currentSlide
					// )
					onSelect()
					handleClose()
					setLevel(0)
					setLoading(false)
				})
		}
	}

	const isInvalid = false

	return (
		<>
			<div className='filexplorer-header'>
				<Icon path={mdilChevronLeft} size={1.5} onClick={handleBack}/>
				<Icon path={mdilChevronRight} size={1.5} onClick={handleForward}/>
				{loading && <Icon path={mdiLoading} size={1.5} spin />}
				<input
					type="text"
					name="search"
					className='filexplorer-search'
					placeholder="Search"
					onChange={handleSearch}
					onClick={handleSearch}
				/>
			</div>
			{error && <p className='filexplorer-error'>{error}</p>}
			<Levels
				level={level}
				connections={connections}
				databases={databases}
				tables={tables}
				filteredOption={filteredOption}
				onSelectConnection={handleSelectConnection}
				onSelectDatabase={handleSelectDatabase}
				onSelectTable={handleSelectTable}
			/>
			<br />
			<input
				disabled={isInvalid}
				className='modal-button'
				type="button"
				value="Open"
				onClick={handleSelectTable}
				style={{color: isInvalid ? "rgb(0, 0, 0, 0.5)" : color}}
			/>
			<input
				className='modal-button'
				type="button"
		  	value="Cancel"
		  	onClick={handleClose}
			/>
		</>
	)
}

const Levels = ({ level, filteredOption, onSelectConnection, onSelectDatabase, onSelectTable }) =>
	<div className='filexplorer-content'>
		{
			{
				'connections': filteredOption.map((connection, index) => (
						<div className='filexplorer-content-text' onClick={() => onSelectConnection(connection)} key={index}>
							<p>{connection}</p>
						</div>
					)),
				'databases': filteredOption.map((database, index) => (
						<div className='filexplorer-content-text' onClick={() => onSelectDatabase(database)} key={index}>
							<p>{database}</p>
						</div>
					)),
				'tables': filteredOption.map((table, index) => (
						<div className='filexplorer-content-text' onClick={() => onSelectTable(table)} key={index}>
							<p>{table}</p>
						</div>
					)),
			}[LEVELS_STATES[level]]
		}
	</div>

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
	)
)(ImportConnection)
