//
//  StatisticsEditor
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Notes:
//	newOptions doesn't auto update on change
//
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiLoading, mdiClose } from '@mdi/js'

import statistics from '../statisticsR'
import { doRegression, spreadsheetToR } from '../../Spreadsheet/cloudr'
import { getMaxNumberCustomSheet } from '../../../functions'
import DataRange from '../datarange'
import Anova from './Anova'
import Manova from './Manova'
import Number from './Number'
import Variable from './Variable'
import Formula from './Formula'
import Matrix from './Matrix'
import MultipleLinearRegression from './MultipleLinearRegression'
import { withFirebase } from '../../Firebase'

function setFormula(slides, datarange, formula) {
	const current = slides.bottombar.dataNames.indexOf(slides.data.name)
	return {
		slides: JSON.stringify(spreadsheetToR(slides.datas)),
		names: JSON.stringify(slides.bottombar.dataNames),
		formulatext: formula,
		range: datarange,
	}
}

function setSparkData(slides, formula) {
	const current = slides.bottombar.dataNames.indexOf(slides.data.name)
	return {
		formulatext: formula,
		name: slides.datas[current].name,
	}
}

const ALTERNATIVES = ["two.sided", "greater", "less"]
const VAR_EQUAL = ["Equal variance", "Pooled variance"]
const TEST_STATISTICS = ["Pillai", "Wilks", "Hotelling-Lawley", "Roy"]
const CORRELATION_TYPE = ["pearson", "spearman", "kendall"]

function setStatisticalFunciton(
		statistic, oneWayAnova, randomizedBlockDesign, twoWayAnova, analysisOfCovariance, oneWayWithin, twoWayWithin, twoWayBetween, test,
		linearRegressionVars, linearRegressionVars2, formulaText, formulaText2, variableX, variableY, variableZ, groups, blocks,
		alt, varEqual, trueMean, confidenceLevel, level, paired, matrix, corr
	) {
	let isVarEqual = VAR_EQUAL[varEqual] === VAR_EQUAL[1]
	let statisticalFunction = statistic.function
	if (oneWayAnova != "") statisticalFunction = statisticalFunction + oneWayAnova + ",currentLattitude"
	if (randomizedBlockDesign != "") statisticalFunction = statisticalFunction + randomizedBlockDesign + ",currentLattitude"
	if (twoWayAnova != "") statisticalFunction = statisticalFunction + twoWayAnova + ",currentLattitude"
	if (analysisOfCovariance != "") statisticalFunction = statisticalFunction + analysisOfCovariance + ",currentLattitude"
	if (oneWayWithin != "") statisticalFunction = statisticalFunction + oneWayWithin + ",currentLattitude"
	if (twoWayWithin != "") statisticalFunction = statisticalFunction + twoWayWithin + ",currentLattitude"
	if (twoWayBetween != "") statisticalFunction = statisticalFunction + twoWayBetween + ",currentLattitude"
	if (linearRegressionVars != "") statisticalFunction = statisticalFunction + "lm(" + linearRegressionVars + ",currentLattitude)"
	if (linearRegressionVars2 != "") statisticalFunction = statisticalFunction + "lm(" + linearRegressionVars2 + ",currentLattitude)"
	if (formulaText != "") statisticalFunction = statisticalFunction + "lm(" + formulaText + ",currentLattitude)"
	if (formulaText2 != "") statisticalFunction = statisticalFunction + "lm(" + formulaText2 + ",currentLattitude)"

	// supplemental variables
	if (variableX != null) statisticalFunction = statisticalFunction + ",x=currentLattitude$" + variableX
	if (variableY != null) statisticalFunction = statisticalFunction + ",y=currentLattitude$" + variableY
	if (variableZ != null) statisticalFunction = statisticalFunction + ",z=currentLattitude$" + variableZ
	if (ALTERNATIVES[alt] != "two.sided") statisticalFunction = statisticalFunction + ",alternative=" + ALTERNATIVES[alt]
	if (isVarEqual != false) statisticalFunction = statisticalFunction + ",var.equal=TRUE"
	if (trueMean != 0) statisticalFunction = statisticalFunction + ",mu=" + trueMean
	if (paired != false) statisticalFunction = statisticalFunction + ",var.equal=" + paired
	if (confidenceLevel != 0.95) statisticalFunction = statisticalFunction + ",conf.level=" + confidenceLevel
	if (level != 0.95) statisticalFunction = statisticalFunction + ",level=" + level

	if (statisticalFunction.includes('cbind(')) {
		statisticalFunction = 'tidy(' + statisticalFunction + '),test="' + TEST_STATISTICS[test] + '")'
	} else {
		if (matrix != "") statisticalFunction = statisticalFunction + matrix
		if (corr != 0) statisticalFunction = statisticalFunction + ",method=" + CORRELATION_TYPE[corr]
		statisticalFunction = 'tidy(' + statisticalFunction + '))'
	}
	return statisticalFunction
}

function cbindDependents(dependents, variables) {
	let stringDependents = 'cbind(`' + variables[dependents[0]] + '`'
	for (var i=1; i<dependents.length; i++) {
		stringDependents = stringDependents + ',`' + variables[dependents[i]] + '`'
	}

	stringDependents = stringDependents + ')'
	return stringDependents
}

const StatisticsEditor = ({ firebase, authUser, color, slides, dataNames, current,
	onSetDataNames, onSetCurrent, onSetRightSidebar, statistic, setStatistic }) => {
	const [variables, setVariables] = useState([])
	const [datarange, setDatarange] = useState('')
	const [oneWayAnova, setOneWayAnova] = useState('')
	const [randomizedBlockDesign, setRandomizedBlockDesign] = useState('')
	const [twoWayAnova, setTwoWayAnova] = useState('')
	const [analysisOfCovariance, setAnalysisOfCovariance] = useState('')
	const [oneWayWithin, setOneWayWithin] = useState('')
	const [twoWayWithin, setTwoWayWithin] = useState('')
	const [twoWayBetween, setTwoWayBetween] = useState('')
	const [test, setTest] = useState(0)
	const [linearRegressionVars, setLinearRegressionVars] = useState('')
	const [linearRegressionVars2, setLinearRegressionVars2] = useState('')
	const [formulaText, setFormulaText] = useState('')
	const [formulaText2, setFormulaText2] = useState('')
	const [variableX, setVariableX] = useState(null)
	const [variableY, setVariableY] = useState(null)
	const [variableZ, setVariableZ] = useState(null)
	const [alt, setAlt] = useState(0)
	const [varEqual, setVarEqual] = useState(0)
	const [trueMean, setTrueMean] = useState(0)
	const [confidenceLevel, setConfidenceLevel] = useState(0.95)
	const [paired, setPaired] = useState(false)
	const [groups, setGroups] = useState(null)
	const [blocks, setBlocks] = useState(null)
	const [matrix, setMatrix] = useState([])
	const [corr, setCorr] = useState(0)
	const [successes, setSuccesses] = useState(1)
	const [trials, setTrials] = useState(1)
	const [prob, setProb] = useState(0.5)
	const [datarangeError, setDatarangeError] = useState(null)
	const [formulaError, setFormulaError] = useState(null)
	const [formulaError2, setFormulaError2] = useState(null)
	const [trueMeanError, setTrueMeanError] = useState(null)
	const [confidenceLevelError, setConfidenceLevelError] = useState(null)
	const [successesError, setSuccessesError] = useState(null)
	const [trialsError, setTrialsError] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (slides.data.type !== "chart" && !(Object.keys(slides.data.rows._).length === 0 && slides.data.rows._.constructor === Object)) {
			setVariables(Object.values(slides.data.rows._[0].cells)
				.map(variable => Object.values(variable)[0]))
		}
	}, [])

	const handleSetOneWayAnova = (dependent, independent) =>
		setOneWayAnova('`' + variables[dependent] + '`~`' + variables[independent] + '`')

	const handleSetRandomizedBlockDesign = (dependent, independent, blocks) =>
		setRandomizedBlockDesign('`' + variables[dependent] + '`~`' + variables[independent] +  '`+`' + variables[blocks] + '`')

	const handleSetTwoWayAnova = (dependent, independent, blocks, independent2) =>
		setTwoWayAnova('`' + variables[dependent] + '`~`' + variables[independent] + '`*`' + variables[independent2] + '`')

	const handleSetAnalysisOfCovariance = (dependent, independent, blocks, independent2, covariate) =>
		setAnalysisOfCovariance('`' + variables[dependent] + '`~`' + variables[independent] + '`+`' + variables[covariate] + '`')

	const handleSetOneWayWithin = (dependent, independent, blocks, independent2, covariate, subject) =>
		setOneWayWithin('`' + variables[dependent] + '`~`' + variables[independent]
			+ '`+Error(`' + variables[subject] + '`/`' + variables[independent] + '`)')

	const handleSetTwoWayWithin = (dependent, independent, blocks, independent2, covariate, subject) =>
		setTwoWayWithin('`' + variables[dependent] + '`~(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2] + '`))')

	const handleSetTwoWayBetween = (dependent, independent, blocks, independent2, covariate, subject, between1, between2) =>
		setTwoWayBetween('`' + variables[dependent] + '`~(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`*`' + variables[between1] + '`*`' + variables[between2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`))+(`' + variables[between1] + '`*`' + variables[between2] + '`)')

	const handleSetOneWayManova = (test, dependents, independent) => {
		setTest(test)
		setOneWayAnova(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`')
	}

	const handleSetRandomizedBlockDesignManova = (test, dependents, independent, blocks) => {
		setTest(test)
		setRandomizedBlockDesign(cbindDependents(dependents, variables) + '~`' + variables[independent] +  '`+`' + variables[blocks] + '`')
	}

	const handleSetTwoWayManova = (test, dependents, independent, blocks, independent2) => {
		setTest(test)
		setTwoWayAnova(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`*`' + variables[independent2] + '`')
	}

	const handleSetAncova = (test, dependents, independent, blocks, independent2, covariate) => {
		setTest(test)
		setAnalysisOfCovariance(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`+`' + variables[covariate] + '`')
	}

	const handleSetOneWayWithinManova = (test, dependents, independent, blocks, independent2, covariate, subject) => {
		setTest(test)
		setOneWayWithin(cbindDependents(dependents, variables) + '~`' + variables[independent]
			+ '`+Error(`' + variables[subject] + '`/`' + variables[independent] + '`)')
	}

	const handleSetTwoWayWithinManova = (test, dependents, independent, blocks, independent2, covariate, subject) => {
		setTest(test)
		setTwoWayWithin(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`*`' + variables[independent2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2] + '`))')
	}

	const handleSetTwoWayBetweenManova = (test, dependents, independent, blocks, independent2, covariate, subject, between1, between2) => {
		setTest(test)
		setTwoWayBetween(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`*`' + variables[independent2]
			+ '`*`' + variables[between1] + '`*`' + variables[between2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`))+(`' + variables[between1] + '`*`' + variables[between2] + '`)')
	}

	const handleSetMultipleLinearRegressionVars = (dependent, selectedVariables) => {
		let independent = '`' + variables[selectedVariables[0]] + '`'
		for (var i=1; i<selectedVariables.length; i++) {
			independent.concat('+`', variables[selectedVariables[i]],'`')
		}
		setLinearRegressionVars('`' + variables[dependent] + '`~' + independent)
	}

	const handleSetMultipleLinearRegressionVars2 = (dependent, selectedVariables) => {
		let independent = '`' + variables[selectedVariables[0]] + '`'
		for (var i=1; i<selectedVariables.length; i++) {
			independent.concat('+`', variables[selectedVariables[i]],'`')
		}
		setLinearRegressionVars2('`' + variables[dependent] + '`~' + independent)
	}

	const handleSetFormula = formula => setFormulaText(formula)

	const handleSetFormula2 = formula => setFormulaText2(formula)

	const handleUpdateVariableX = activeOption => setVariableX(activeOption)

	const handleUpdateVariableY = activeOption => setVariableY(activeOption)

	const handleUpdateVariableZ = activeOption => setVariableZ(activeOption)

	const handleUpdateGroups = activeOption => setGroups(activeOption)

	const handleUpdateBlocks = activeOption => setBlocks(activeOption)

	const handleUpdateAlt = activeOption => setAlt(activeOption)

	const handleChangeSuccesses = e => {
		let input = e.target.value
		setSuccesses(input)
		if (Number.isInteger(parseFloat(input))) {
			setSuccessesError(null)
		} else {
			setSuccessesError("Successes must be a positive integer greater or equal to the number of trials.")
		}
	}

	const handleChangeTrials = e => {
		let input = e.target.value
		setTrials(input)
		if (Number.isInteger(parseFloat(input))) {
			setTrialsError(null)
		} else {
			setTrialsError("Trials must be a nonnegative integer.")
		}
	}

	const handleChangeTrueMean = e => {
		let input = e.target.value
		setTrueMean(input)
		if (isNaN(parseFloat(input))) {
			setTrueMeanError("True mean must be a number.")
		} else {
			setTrueMeanError(null)
		}
	}

	const handleChangeConfidenceLevel = e => {
		let input = e.target.value
		setConfidenceLevel(input)
		if (isNaN(parseFloat(input))) {
			setConfidenceLevelError("Confidence level must be a number.")
		} else if (parseFloat(input) > 1 || parseFloat(input) < 0) {
			setConfidenceLevelError("Confidence Level must be between 0 and 1.")
		} else {
			setConfidenceLevelError(null)
		}
	}

	const handleChangeVarEqual = activeOption => setVarEqual(activeOption)

	const handleChangePaired = () => setPaired(!paired)

	const handleUpdateMatrix = newSelectedVariables => setMatrix(newSelectedVariables)

	const handleUpdateCorr = activeOption => setCorr(activeOption)

	const handleSubmit = () => {
		setLoading(true)
		let statisticalFunction = setStatisticalFunciton(
			statistics[statistic],
			oneWayAnova,
			randomizedBlockDesign,
			twoWayAnova,
			analysisOfCovariance,
			oneWayWithin,
			twoWayWithin,
			twoWayBetween,
			test,
			linearRegressionVars,
			linearRegressionVars2,
			formulaText,
			formulaText2,
			variables[variableX],
			variables[variableY],
			variables[variableZ],
			groups,
			blocks,
			alt,
			varEqual,
			trueMean,
			confidenceLevel,
			paired,
			matrix.length > 0 ? cbindDependents(matrix, variables) : matrix,
			corr
		)
		if (statisticalFunction.includes("()")) {
			setError('Select columns to analyze')
			setLoading(false)
			return
		}
		let formulaData = setFormula(slides, datarange, statisticalFunction)
		let statName = statistics[statistic].key + ' '
			+ getMaxNumberCustomSheet(slides.bottombar.dataNames, statistics[statistic].key)
		let sparkData = setSparkData(slides, statisticalFunction)
		doRegression(formulaData)
			.then(res => {
				if (typeof res[0] === "string" || res[0] instanceof String) {
					setError(res)
					setLoading(false)
				} else {
					res.name = statName
					res.type = "regression"
					res.regression = sparkData
					const d = slides.insertData(dataNames, current, res, name)
					onSetDataNames([
			      ...dataNames.slice(0, current+1),
			      d.name,
			      ...dataNames.slice(current+1)
			    ])
					onSetCurrent(current+1)
					slides.data = d
					onSetRightSidebar('none')
					setStatistic(null)
					setLoading(false)
				}
		  })
	}

	const handleClose = () => {
		onSetRightSidebar('none')
		setStatistic(null)
		setLoading(false)
	}

	const isInvalid = variables.length < 1
		|| trueMeanError !== null
		|| confidenceLevelError !== null
		|| datarangeError !== null

	return (
    <>
			<button className='rightsidebar-close' onClick={handleClose}>
				<Icon path={mdiClose} size={1}/>
			</button>
			<div className='rightsidebar-heading'>
				{statistics[statistic].key}
			</div>
			<DataRange datarange={datarange} setDatarange={setDatarange} error={datarangeError} setError={setDatarangeError} />
			{statistics[statistic].arguments.includes("oneWayAnova") &&
				<Anova
					variables={variables}
					onChange={handleSetOneWayAnova}
				/>}
			{statistics[statistic].arguments.includes("randomizedBlockDesign") &&
				<Anova
					variables={variables}
					onChange={handleSetRandomizedBlockDesign}
					hasBlocks={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayAnova") &&
				<Anova
					variables={variables}
					onChange={handleSetTwoWayAnova}
					hasIndependent2={true}
				/>}
			{statistics[statistic].arguments.includes("analysisOfCovariance") &&
				<Anova
					variables={variables}
					onChange={handleSetAnalysisOfCovariance}
					hasCovariate={true}
				/>}
			{statistics[statistic].arguments.includes("oneWayWithin") &&
				<Anova
					variables={variables}
					onChange={handleSetOneWayWithin}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayWithin") &&
				<Anova
					variables={variables}
					onChange={handleSetTwoWayWithin}
					hasIndependent2={true}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayBetween") &&
				<Anova
					variables={variables}
					onChange={handleSetTwoWayBetween}
					hasIndependent2={true}
					hasSubject={true}
					hasBetween={true}
				/>}
			{statistics[statistic].arguments.includes("oneWayManova") &&
				<Manova
					variables={variables}
					onChange={handleSetOneWayManova}
				/>}
			{statistics[statistic].arguments.includes("randomizedBlockDesignManova") &&
				<Manova
					variables={variables}
					onChange={handleSetRandomizedBlockDesignManova}
					hasBlocks={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayManova") &&
				<Manova
					variables={variables}
					onChange={handleSetTwoWayManova}
					hasIndependent2={true}
				/>}
			{statistics[statistic].arguments.includes("mancova") &&
				<Manova
					variables={variables}
					onChange={handleSetAncova}
					hasCovariate={true}
				/>}
			{statistics[statistic].arguments.includes("oneWayWithinManova") &&
				<Manova
					variables={variables}
					onChange={handleSetOneWayWithinManova}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayWithinManova") &&
				<Manova
					variables={variables}
					onChange={handleSetTwoWayWithinManova}
					hasIndependent2={true}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayBetweenManova") &&
				<Manova
					variables={variables}
					onChange={handleSetTwoWayBetweenManova}
					hasIndependent2={true}
					hasSubject={true}
					hasBetween={true}
				/>}
			{statistics[statistic].arguments.includes("multipleLinearRegression") && <>
				<h5>Linear model</h5>
				<MultipleLinearRegression
					variables={variables}
					onChange={handleSetMultipleLinearRegressionVars}
				/></>}
			{statistics[statistic].arguments.includes("multipleLinearRegression2") && <>
				<h5>Linear model 2</h5>
				<MultipleLinearRegression
					variables={variables}
					onChange={handleSetMultipleLinearRegressionVars2}
				/></>}
	        {statistics[statistic].arguments.includes("formula") &&
	        	<Formula
					formulaText={formulaText}
					variables={variables}
					onSetFormula={handleSetFormula}
					formulaError={formulaError}
				/>}
			{statistics[statistic].arguments.includes("formula2") &&
				<Formula
					formulaText={formulaText2}
					variables={variables}
					onSetFormula={handleSetFormula2}
					formulaError={formulaError2}
				/>}
	        {statistics[statistic].arguments.includes("xvariable") &&
				<Variable
					label="X variable"
					onChange={handleUpdateVariableX}
					options={variables}
					name={variables[variableX]}
				/>}
	        {statistics[statistic].arguments.includes("yvariable") &&
	        	<Variable
					label="Y variable"
					onChange={handleUpdateVariableY}
					options={variables}
					name={variables[variableY]}
				/>}
			{statistics[statistic].arguments.includes("zvariable") &&
				<Variable
					label="Z variable"
					onChange={handleUpdateVariableZ}
					options={variables}
					name={variables[variableZ]}
				/>}
			{statistics[statistic].arguments.includes("groups") &&
	       <Variable
					label="Grouping factor"
					onChange={handleUpdateGroups}
					options={variables}
					name={variables[groups]}
				/>}
			{statistics[statistic].arguments.includes("blocks") &&
			 	<Variable
					label="Blocking factor"
					onChange={handleUpdateBlocks}
					options={variables}
					name={variables[blocks]}
				/>}
	    {statistics[statistic].arguments.includes("varEqual") &&
				<Variable
					label="Equal variance or pooled variance"
					onChange={handleChangeVarEqual}
					options={VAR_EQUAL}
					name={VAR_EQUAL[varEqual]}
				/>}
	    {statistics[statistic].arguments.includes("alt") &&
	      <Variable
					label="Alternative"
					onChange={handleUpdateAlt}
					options={ALTERNATIVES.map(alternative => {return alternative.replace(".", " ")})}
					name={ALTERNATIVES[alt]}
				/>}
			{statistics[statistic].arguments.includes("successes") &&
				<Number
					label='Number of successes'
					value={successes}
					onChange={handleChangeSuccesses}
					error={successesError}
				/>}
			{statistics[statistic].arguments.includes("trials") &&
				<Number
					label='Number of trials'
					value={trials}
					onChange={handleChangeTrials}
					error={trialsError}
				/>}
	    {statistics[statistic].arguments.includes("mu") &&
				<Number
					label='True value of the mean (or difference in means)'
					value={trueMean}
					onChange={handleChangeTrueMean}
					error={trueMeanError}
				/>}
	    {/*{statistics[statistic].arguments.includes("paired") &&
	      <input
					type="checkbox"
					name="paired"
					value={paired}
					onChange={handleChangePaired}
				/>}*/}
	    {statistics[statistic].arguments.includes("conf") &&
				<Number
					label='Confidence level'
					value={confidenceLevel}
					onChange={handleChangeConfidenceLevel}
					error={confidenceLevelError}
				/>}
			{statistics[statistic].arguments.includes("matrix") &&
				<Matrix
					variables={variables}
					selectedVariables={matrix}
					setSelectedVariables={handleUpdateMatrix}
				/>}
			{statistics[statistic].arguments.includes("corr") &&
				<Variable
					label="Type of correlation"
					onChange={handleUpdateCorr}
					options={CORRELATION_TYPE}
					name={CORRELATION_TYPE[corr]}
				/>}
			<div className='rightsidebar-text'>
				{"description" in statistics[statistic] && <p>{statistics[statistic].description}</p>}
				{error && <p>{error}</p>}
			</div>
			{loading
				?	<div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin /></div>
				: <input
						disabled={isInvalid}
						type="submit"
						style={{ color : isInvalid ? "rgb(0, 0, 0, 0.5)" : color[authUser.uid]}}
						onClick={handleSubmit}
						className='rightsidebar-submit'
					/>
			}
  	</>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
	slides: (state.slidesState.slides || {}),
	dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
	current: (state.currentState.current || 0),
	rightSidebar: (state.rightSidebarState.rightSidebar || "none"),
});

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
  onSetRightSidebar: rightSidebar => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(StatisticsEditor)
