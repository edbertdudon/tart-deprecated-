import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

import { translateR } from '../Spreadsheet/cloudR'
import charts from './chartsR'

export function setChart(slides, variables, chartsIndex, variablex, variabley) {
	let current
	if (slides.data.type === "chart") {
		current = slides.bottombar.dataNames.indexOf(slides.data.chart.name)
	} else {
		current = slides.bottombar.dataNames.indexOf(slides.data.name)
	}
	let chartTypes = []
	let chartVariables = []
	for (var i=0; i<chartsIndex.length; i++) {
		chartTypes.push(charts[chartsIndex[i]].type)
		chartVariables.push(charts[chartsIndex[i]].variables)
	}
	let chartData = {
		name: slides.datas[current].name,
		type: chartTypes.join("+"),
	}
	if (Math.max(...chartVariables) > 0 && variables.length > 0) {
		chartData["variablex"] = translateR(variables[variablex], slides.datas[current].name)
	}
	if (Math.max(...chartVariables) > 1 && variables.length > 1) {
		chartData["variabley"] = translateR(variables[variabley], slides.datas[current].name)
	}
	return(chartData)
}

const Charts = ({ authUser, color, slides, setRightSidebar, setSelectedCharts }) => {
	const [filteredOption, setFilteredOption] = useState(charts)

	const handleSelectChart = chart => {
		// setRightSidebar('charteditor')
		// let chartNumber
		// for (var i=0; i<charts.length; i++) {
		// 	if (chart === charts[i].key) {
		// 		chartNumber = i
		// 		break;
		// 	}
		// }
		// setSelectedCharts([chartNumber])
		const { data } = slides
		if (data.type !== "chart") {
			// let variables
			// if (Object.keys(slides.data.rows._).length === 0 && slides.data.rows._.constructor === Object) {
			// 	variables = []
			// } else {
			// 	variables = Object.values(slides.data.rows._[0].cells)
			// 		.map(variable => Object.values(variable)[0])
			// }
			// let chartData = setChart(slides, variables, [chartNumber], 0, 1, 2)
			let chartData = {
				name: data.name,
				type: chart,
			}
			console.log(chartData)
			// dispatchSlides({function:'CHART', data: chartData, name:("Chart" + getMaxNumberFile(slides, "Chart")), currentSlide: currentSlide, type:"chart"})
			// setCurrentSlide(currentSlide+1)
		}
	}

	const handleSearch = e => {
		let input = e.target.value
		let filter = charts.filter(chart =>
			chart.key.toLowerCase().includes(input.toLowerCase())
		)
		setFilteredOption(filter)
	}

	const handleEditor = () => {
		setRightsidebar('charteditor')
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
				<div className='rightsidebar-item' onClick={() => handleSelectChart(chart.key)} key={index}>
					{chart.key}
				</div>
			))}
		</>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
	slides: (state.slidesState.slides || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(Charts)
