import React, { useState } from 'react'
import statistics from './statisticsR'

const Statistics = ({ setRightSideBar, setSelectedAnalysis }) => {
	const [filteredOption, setFilteredOption] = useState(statistics)

	const handleSelectStatistic = (statistic) => {
		let statisticNumber
		for (var i=0; i<statistics.length; i++) {
			if (statistic === statistics[i].name) {
				statisticNumber = i
				break;
			}
		}
		setSelectedAnalysis(statisticNumber)
	}

	const handleSearch = e => {
		let input = e.target.value
		let filter
		if (input.length < 1) {
			filter = statistics.filter(statistic => statistic.name
				.toLowerCase()
				.includes(input.toLowerCase()))
		} else {
			filter = statistics
				.filter(statistic => statistic.hasOwnProperty('function'))
				.filter(statistic => statistic.name
					.toLowerCase()
					.includes(input.toLowerCase()))
		}
		setFilteredOption(filter)
	}

	const handleEditor = () => {
		setRightSideBar('charteditor')
	}

	return (
		<div>
			<div className='rightsidebar-heading'>Statistics</div>
			<input
				type="text"
				name="search"
				className='rightsidebar-search'
				placeholder="Search"
				onChange={handleSearch}
			/>
			{filteredOption.map((statistic, index) => ("function" in statistic)
				?	<div className='rightsidebar-item' onClick={() => handleSelectStatistic(statistic.name)} key={index}>
						{statistic.name}
					</div>
				:	<div className='rightsidebar-item-header' key={index}>{statistic.name}</div>
			)}
		</div>
	)
}

export default Statistics
