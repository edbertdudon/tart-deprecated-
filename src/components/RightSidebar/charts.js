import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

// import { setChart } from '../functions'
import { getMaxNumberCustomFile } from '../../functions'
import charts from './chartsR'

const Charts = ({ authUser, color, setRightSidebar, setSelectedCharts }) => {
	const [filteredOption, setFilteredOption] = useState(charts)

	const handleSelectChart = chart => {
		setRightSideBar('charteditor')
		let chartNumber
		for (var i=0; i<charts.length; i++) {
			if (chart === charts[i].name) {
				chartNumber = i
				break;
			}
		}
		setSelectedCharts([chartNumber])
		let variables = []
		// if (slides[currentSlide].type !== "chart") {
		// 	let slide = slides[currentSlide]
		// 	for (var j=0; j<slide.data[0].length; j++) {
		// 		if (slide.data[0][j].value !== "" && slide.data[0][j].value != null) {
		// 			variables.push(slide.data[0][j].value)
		// 		}
		// 	}
		// }
		// let chartData = setChart(slides, currentSlide, variables, [chartNumber], 0, 1, 2)
		// dispatchSlides({function:'CHART', data: chartData, name:("Chart" + getMaxNumberFile(slides, "Chart")), currentSlide: currentSlide, type:"chart"})
		// setCurrentSlide(currentSlide+1)
	}

	const handleSearch = e => {
		let input = e.target.value
		let filter = charts.filter(chart =>
			chart.name.toLowerCase().includes(input.toLowerCase())
		)
		setFilteredOption(filter)
	}

	const handleEditor = () => {
		setRightSideBar('charteditor')
	}

	return (
		<>
			<div className='rightsidebar-heading'>
				Charts
				<div className='rightsidebar-back' style={{color: color[authUser.uid]}} onClick={handleEditor}>Editor</div>
			</div>
			<input
				type="text"
				name="search"
				className='rightsidebar-search'
				placeholder="Search"
				onChange={handleSearch}
			/>
			{filteredOption.map((chart, index) => (
				<div className='rightsidebar-item' onClick={() => handleSelectChart(chart.name)} key={index}>
					{chart.name}
				</div>
			))}
		</>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(Charts)
