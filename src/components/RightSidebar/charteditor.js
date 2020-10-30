import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import charts from './chartsR'
import withLists from './withLists'
import withListsDropdown from './withListsDropdown'
import { setChart } from './charts'

const ChartEditor = ({ slides, schart, setSchart }) => {
	const [variables, setVariables] = useState([])
	const [variableX, setVariableX] = useState(0)
	const [variableY, setVariableY] = useState(1)

	useEffect(() => {
		if ((Object.keys(slides.data.rows._).length === 0 && slides.data.rows._.constructor === Object) || !("0" in slides.data.rows._)) {
			return
		}
		let current
		if (slides.data.type === "chart") {
			current = slides.bottombar.dataNames.indexOf(slides.data.chart.name)
		} else {
			current = slides.bottombar.dataNames.indexOf(slides.data.name)
		}
		let slide = slides.datas[current]
		if (!(current == -1)) {
			setVariables(Object.values(slides.data.rows._[0].cells)
				.map(variable => Object.values(variable)[0]))
		}
		if (slides.data.type === "chart") {
			let varx = slides.data.chart.variablex
			let currentVarX = newOptions.map(variable => {return variable})
				.indexOf(varx)
			setVariableX(currentVarX)

			if ("variabley" in slides[currentSlide].data) {
				let vary = slides.data.chart.variabley
				let currentVarY = newOptions.map(variable => {return variable})
					.indexOf(vary)
				setVariableY(currentVarY)
			}
		}
	}, [])

	// useEffect(() => {
	// 	if (slides[currentSlide].type === "chart") {
	// 		let chartTypes = slides[currentSlide].data.type.split("+")
	// 		let types = charts.map(chart => {return chart.type})
	//
	// 		let chartIndex = []
	// 		for (var i=0; i<chartTypes.length; i++) {
	// 			chartIndex.push(types.indexOf(chartTypes[i]))
	// 		}
	// 		setSchart(chartIndex)
	// 	}
	// }, [currentSlide])

	const handleUpdateChart = (newSelectedCharts) => {
		let chartData = setChart(slides, currentSlide, variables, newSelectedCharts, variableX, variableY)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleUpdateVariableX = (activeOption) => {
		setVariableX(activeOption)
		let chartData = setChart(slides, currentSlide, variables, schart, activeOption, variableY)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleUpdateVariableY = (activeOption) => {
		setVariableY(activeOption)
		let chartData = setChart(slides, currentSlide, variables, schart, variableX, activeOption)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleAddChart = (activeOption) => {
		let newSelectedCharts = [...schart, activeOption]
		setSchart(newSelectedCharts)
		let chartData = setChart(slides, currentSlide, variables, newSelectedCharts, variableX, variableY)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	return (
		<>
			{(schart.length < 1)
				? <div className='rightsidebar-none'>No chart selected</div>
				: <>
						<div className='rightsidebar-label'>Chart Type</div>
						{schart.map((selected, index) => (
							<ChartsWithListsDropdown
								onChange={handleUpdateChart}
								options={charts}
								name={charts[selected].key}
								selection={schart}
								setSelection={setSchart}
								currentSelection={index}
								key={index}
							/>
						))}
						<ChartsWithLists
							onChange={handleAddChart}
							options={charts.filter(item => charts[schart[0]].variables === item.variables)}
							name='Add Additonal Chart'
							styles={{color: "#aaa"}}
						/>
						<div className='rightsidebar-label'>X-Axis</div>
						<OptionsWithLists
							onChange={handleUpdateVariableX}
							options={variables}
							name={variables[variableX]}
						/>
						{(charts[schart[0]].variables > 1) &&
							<>
								<div className='rightsidebar-label'>Y-Axis</div>
								<OptionsWithLists
									onChange={handleUpdateVariableY}
									options={variables}
									name={variables[variableY]}
								/>
							</>
						}
					</>
			}
		</>
	)
}


const Charts = ({ option }) => option.key
const Options = ({ option }) => option

const ChartsWithListsDropdown = withListsDropdown(Charts)
const ChartsWithLists = withLists(Charts)
const OptionsWithLists = withLists(Options)

const mapStateToProps = state => ({
	slides: (state.slidesState.slides || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(ChartEditor)
