import React, { useState, useEffect } from 'react'
import charts from './chartsR'
import withLists from './withLists'
import withListsDropdown from './withListsDropdown'
// import { setChart } from '../functions'

const ChartEditor = ({ selectedCharts, setSelectedCharts }) => {
	const [variables, setVariables] = useState([])
	const [variableX, setVariableX] = useState(0)
	const [variableY, setVariableY] = useState(1)

	// useEffect(() => {
	// 	if (slides[0].data == null) return
	// 	let current
	// 	if (slides[currentSlide].type === "chart") {
	// 		let sheetname = slides[currentSlide].data.name
	// 		current = slides.map(slide => {return slide.name})
	// 			.indexOf(sheetname)
	// 	} else {
	// 		current = currentSlide
	// 	}
	// 	let newOptions = []
	// 	let slide = slides[current]
	// 	if (current == -1) {
	// 		setVariables(newOptions)
	// 	} else {
	// 		for (var j=0; j<slide.data[0].length; j++) {
	// 			if (slide.data[0][j].value !== "" && slide.data[0][j].value != null) newOptions.push(slide.data[0][j].value)
	// 		}
	// 		setVariables(newOptions)
	// 	}
	// 	if (slides[currentSlide].type === "chart") {
	// 		let varx = slides[currentSlide].data.variablex
	// 		let currentVarX = newOptions.map(variable => {return variable})
	// 			.indexOf(varx)
	// 		setVariableX(currentVarX)
	//
	// 		if ("variabley" in slides[currentSlide].data) {
	// 			let vary = slides[currentSlide].data.variabley
	// 			let currentVarY = newOptions.map(variable => {return variable})
	// 				.indexOf(vary)
	// 			setVariableY(currentVarY)
	// 		}
	// 	}
	// }, [slides, currentSlide])

	// useEffect(() => {
	// 	if (slides[currentSlide].type === "chart") {
	// 		let chartTypes = slides[currentSlide].data.type.split("+")
	// 		let types = charts.map(chart => {return chart.type})
	//
	// 		let chartIndex = []
	// 		for (var i=0; i<chartTypes.length; i++) {
	// 			chartIndex.push(types.indexOf(chartTypes[i]))
	// 		}
	// 		setSelectedCharts(chartIndex)
	// 	}
	// }, [currentSlide])

	const handleUpdateChart = (newSelectedCharts) => {
		let chartData = setChart(slides, currentSlide, variables, newSelectedCharts, variableX, variableY)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleUpdateVariableX = (activeOption) => {
		setVariableX(activeOption)
		let chartData = setChart(slides, currentSlide, variables, selectedCharts, activeOption, variableY)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleUpdateVariableY = (activeOption) => {
		setVariableY(activeOption)
		let chartData = setChart(slides, currentSlide, variables, selectedCharts, variableX, activeOption)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleAddChart = (activeOption) => {
		let newSelectedCharts = [...selectedCharts, activeOption]
		setSelectedCharts(newSelectedCharts)
		let chartData = setChart(slides, currentSlide, variables, newSelectedCharts, variableX, variableY)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	return (
		<>
			{(selectedCharts.length < 1)
				? <div className='rightsidebar-none'>No chart selected</div>
				: <>
						<div className='rightsidebar-label'>Chart Type</div>
						{selectedCharts.map((selected, index) => (
							<ChartsWithListsDropdown
								onChange={handleUpdateChart}
								options={charts}
								name={charts[selected].name}
								selection={selectedCharts}
								setSelection={setSelectedCharts}
								currentSelection={index}
							/>
						))}
						<ChartsWithLists
							onChange={handleAddChart}
							options={charts.filter(chart => charts[selectedCharts[0]].variables === chart.variables)}
							name='Add Additonal Chart'
							styles={{color: "#aaa"}}
						/>
						<div className='rightsidebar-label'>X-Axis</div>
						<OptionsWithLists
							onChange={handleUpdateVariableX}
							options={variables}
							name={variables[variableX]}
						/>
						{(charts[selectedCharts[0]].variables > 1) &&
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


const Charts = ({ option }) => option.name
const Options = ({ option }) => option

const ChartsWithListsDropdown = withListsDropdown(Charts)
const ChartsWithLists = withLists(Charts)
const OptionsWithLists = withLists(Options)

export default ChartEditor
