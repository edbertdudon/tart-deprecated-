//
//  Chart editor
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import charts from './chartsR'
import DataRange from './datarange'
import Button from './button'
import withLists from './withLists'
import withListsDropdown from './withListsDropdown'
import { columnToLetter, translateR, spreadsheetToR } from '../Spreadsheet/cloudR'

function setChart(datarange, name, schart, variablex, variabley, firstRow) {
	let data = {
		range: translateR(datarange, name),
		types: schart.map(c => charts[c].type).join("+"),
		variablex: variablex,
		firstrow: firstRow,
	}
	if (Math.max(...schart.map(c => charts[c].variables)) > 1) {
		chartData["variabley"] = variabley
	}
	return(data)
}

const ChartEditor = ({ authUser, color, slides }) => {
	const [schart, setSchart] = useState([0])
	const [datarange, setDatarange] = useState('')
	const [variables, setVariables] = useState([])
	const [variableX, setVariableX] = useState(null)
	const [variableY, setVariableY] = useState(null)
	const [firstRow, setFirstRow] = useState(true)
	const [datarangeError, setDatarangeError] = useState(null)

	useEffect(() => {
		const { data, datas } = slides
		if ((data.type === "sheet" || data.type === "input") && "0" in data.rows._) {
			const rownames = Object.values(data.rows._[0].cells)
				.map(cell => cell.text)
			const rows = Object.keys(data.rows._)
				.map(row => parseInt(row)+1)
			const cols = rownames.map((t, i) => columnToLetter(i+1))
			setDatarange(cols[0] + ":" + cols[cols.length-1])
			// setDatarange(cols[0] + rows[0] + ":" + cols[cols.length-1] + rows[rows.length-1])
			if (rownames.every(isNaN)) {
				setVariables(rownames)
			} else {
				setVariables(cols.map(col => col + rows[0] + ":" + col + rows[rows.length-1]))
				setFirstRow(false)
			}
		} else if (data.type === "chart") {
			let slide = datas.find(s => s.name === data.name)
			setVariableX(slide.variablex)
			if ("variabley" in slide) {
				setVariableY(slide.variabley)
			}
		}
	}, [])

	const handleUpdateChart = selected => {
		setSchart(selected)
		let data = setChart(
			datarange,
			slides.data.name,
			selected,
			variables[variableX],
			variables[variableY],
			firstRow
		)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleUpdateVariableX = option => {
		setVariableX(option)
		let data = setChart(
			datarange,
			slides.data.name,
			schart,
			variables[option],
			variables[variableY],
			firstRow
		)		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleUpdateVariableY = option => {
		setVariableY(option)
		let data = setChart(
			datarange,
			slides.data.name,
			schart,
			variables[variableX],
			variables[option],
			firstRow
		)		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleAddChart = option => {
		let newScharts = [...schart, option]
		setSchart(newScharts)
		let data = setChart(
			datarange,
			slides.data.name,
			newScharts,
			variables[variableX],
			variables[variableY],
			firstRow
		)
		console.log(chartData)
		// dispatchSlides({function:'UPDATECHART', data: chartData, currentSlide: currentSlide})
	}

	const handleFirstrow = () => {
		setFirstRow(!firstRow)
		if (Object.keys(data.rows._[0].cells).length > 0 && obj.constructor === Object) {
			const { data } = slides
			const rownames = Object.values(data.rows._[0].cells)
				.map(cell => cell.text)
			const rows = Object.keys(data.rows._)
				.map(row => parseInt(row)+1)
			const cols = rownames.map((t, i) => columnToLetter(i+1))
			if (firstRow) {
				setVariables(cols.map(col => col + rows[0] + ":" + col + rows[rows.length-1]))
			} else {
				setVariables(rownames)
			}
		}
	}

	return (
		<>
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
				options={charts.filter((item, index) => charts[schart[0]].variables === item.variables && !schart.includes(index))}
				name='Add Additonal Chart'
				styles={{color: "#aaa"}}
			/>
			<DataRange datarange={datarange} setDatarange={setDatarange} error={datarangeError} setError={setDatarangeError} />
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
			<Button onClick={handleFirstrow} condition={firstRow} text='First row as header' />
		</>
	)
}


const Charts = ({ option }) => option.key
const Options = ({ option }) => option

const ChartsWithListsDropdown = withListsDropdown(Charts)
const ChartsWithLists = withLists(Charts)
const OptionsWithLists = withLists(Options)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
	slides: (state.slidesState.slides || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(ChartEditor)
