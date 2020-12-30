//
//  StatisticsEditor
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Notes:
//	newOptions doesn't auto  on change
//
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiLoading, mdiClose } from '@mdi/js'

import statistics from '../statisticsR'
import { translateR, spreadsheetToR, doRegression } from '../../Spreadsheet/cloudr'
import Anova from '../core/anova'
import Manova from '../core/manova'
import Number from '../../RightSidebar/number'
import Variable from '../core/variable'
import Formula from '../core/formula'
import Matrix from '../core/matrix'
import MultipleLinearRegression from '../core/multiplelinearregression'

const ALTERNATIVES = ["two sided", "greater", "less"]
const VAR_EQUAL = ["Equal variance", "Pooled variance"]
const TEST_STATISTICS = ["Pillai", "Wilks", "Hotelling-Lawley", "Roy"]
const CORRELATION_TYPE = ["pearson", "spearman", "kendall"]
const P_ADJUST = ["holm", "hochberg", "hommel", "bonferroni", "BH", "BY", "fdr", "none"]

const Statistics = ({ authUser, color, slides, dataNames, current,
	onSetDataNames, onSetCurrent, onSetRightSidebar, statistic, setStatistic }) => {
	const [variables, setVariables] = useState([])
	const [columns, setColumns] = useState([])
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
	// const [family, setFamily] = useState(4)
	const [svars, setSvars] = useState([0])
	const [variableX, setVariableX] = useState(null)
	const [variableY, setVariableY] = useState(null)
	const [variableZ, setVariableZ] = useState(null)
	const [groups, setGroups] = useState(null)
	const [blocks, setBlocks] = useState(null)
	const [padj, setPadj] = useState(0)
	const [successes, setSuccesses] = useState(null)
	const [trials, setTrials] = useState(null)
	const [prob, setProb] = useState(0.5)
	const [probs, setProbs] = useState(null)
	const [alt, setAlt] = useState(0)
	const [varEqual, setVarEqual] = useState(0)
	const [trueMean, setTrueMean] = useState(0)
	const [paired, setPaired] = useState(false)
	const [confidenceLevel, setConfidenceLevel] = useState(0.95)
	const [correct, setCorrect] = useState(true)
	const [matrix, setMatrix] = useState([])
	const [corr, setCorr] = useState(0)
	const [formulaError, setFormulaError] = useState(null)
	const [formulaError2, setFormulaError2] = useState(null)
	const [trueMeanError, setTrueMeanError] = useState(null)
	const [confidenceLevelError, setConfidenceLevelError] = useState(null)
	const [successesError, setSuccessesError] = useState(null)
	const [trialsError, setTrialsError] = useState(null)
	const [probError, setProbError] = useState(null)
	const [error, setError] = useState(null)

	const handleVars = i => setVars(i)

	const handleAddVars = i => setVars([...vars, i])

	const handleOneWayAnova = (dependent, independent) =>
		setOneWayAnova('`' + variables[dependent] + '`~`' + variables[independent] + '`')

	const handleRandomizedBlockDesign = (dependent, independent, blocks) =>
		setRandomizedBlockDesign('`' + variables[dependent] + '`~`' + variables[independent] +  '`+`' + variables[blocks] + '`')

	const handleTwoWayAnova = (dependent, independent, blocks, independent2) =>
		setTwoWayAnova('`' + variables[dependent] + '`~`' + variables[independent] + '`*`' + variables[independent2] + '`')

	const handleAnalysisOfCovariance = (dependent, independent, blocks, independent2, covariate) =>
		setAnalysisOfCovariance('`' + variables[dependent] + '`~`' + variables[independent] + '`+`' + variables[covariate] + '`')

	const handleOneWayWithin = (dependent, independent, blocks, independent2, covariate, subject) =>
		setOneWayWithin('`' + variables[dependent] + '`~`' + variables[independent]
			+ '`+Error(`' + variables[subject] + '`/`' + variables[independent] + '`)')

	const handleTwoWayWithin = (dependent, independent, blocks, independent2, covariate, subject) =>
		setTwoWayWithin('`' + variables[dependent] + '`~(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2] + '`))')

	const handleTwoWayBetween = (dependent, independent, blocks, independent2, covariate, subject, between1, between2) =>
		setTwoWayBetween('`' + variables[dependent] + '`~(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`*`' + variables[between1] + '`*`' + variables[between2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`))+(`' + variables[between1] + '`*`' + variables[between2] + '`)')

	const handleOneWayManova = (test, dependents, independent) => {
		setTest(test)
		setOneWayAnova(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`')
	}

	const handleRandomizedBlockDesignManova = (test, dependents, independent, blocks) => {
		setTest(test)
		setRandomizedBlockDesign(cbindDependents(dependents, variables) + '~`' + variables[independent] +  '`+`' + variables[blocks] + '`')
	}

	const handleTwoWayManova = (test, dependents, independent, blocks, independent2) => {
		setTest(test)
		setTwoWayAnova(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`*`' + variables[independent2] + '`')
	}

	const handleAncova = (test, dependents, independent, blocks, independent2, covariate) => {
		setTest(test)
		setAnalysisOfCovariance(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`+`' + variables[covariate] + '`')
	}

	const handleOneWayWithinManova = (test, dependents, independent, blocks, independent2, covariate, subject) => {
		setTest(test)
		setOneWayWithin(cbindDependents(dependents, variables) + '~`' + variables[independent]
			+ '`+Error(`' + variables[subject] + '`/`' + variables[independent] + '`)')
	}

	const handleTwoWayWithinManova = (test, dependents, independent, blocks, independent2, covariate, subject) => {
		setTest(test)
		setTwoWayWithin(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`*`' + variables[independent2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2] + '`))')
	}

	const handleTwoWayBetweenManova = (test, dependents, independent, blocks, independent2, covariate, subject, between1, between2) => {
		setTest(test)
		setTwoWayBetween(cbindDependents(dependents, variables) + '~`' + variables[independent] + '`*`' + variables[independent2]
			+ '`*`' + variables[between1] + '`*`' + variables[between2]
			+ '`)+Error(`' + variables[subject] + '`/(`' + variables[independent] + '`*`' + variables[independent2]
			+ '`))+(`' + variables[between1] + '`*`' + variables[between2] + '`)')
	}

	const handleMultipleLinearRegressionVars = (dependent, selectedVariables) => {
		let independent = '`' + variables[selectedVariables[0]] + '`'
		for (var i=1; i<selectedVariables.length; i++) {
			independent.concat('+`', variables[selectedVariables[i]],'`')
		}
		setLinearRegressionVars('`' + variables[dependent] + '`~' + independent)
	}

	const handleMultipleLinearRegressionVars2 = (dependent, selectedVariables) => {
		let independent = '`' + variables[selectedVariables[0]] + '`'
		for (var i=1; i<selectedVariables.length; i++) {
			independent.concat('+`', variables[selectedVariables[i]],'`')
		}
		setLinearRegressionVars2('`' + variables[dependent] + '`~' + independent)
	}

	const handleFormula = e => setFormulaText(e)

	const handleFormula2 = e => setFormulaText2(e)

	// const handleSetFamily = family => setFamily(family)

	const handleVariableX = i => setVariableX(i)

	const handleVariableY = i => setVariableY(i)

	const handleVariableZ = i => setVariableZ(i)

	const handleGroups = i => setGroups(i)

	const handleBlocks = i => setBlocks(i)

	const handlePadj = i => setPadj(i)

	const handleSuccesses = e => {
		let input = e.target.value
		setSuccesses(input)
		let n = parseFloat(input)
		if (Number.isInteger(n) && n <= trials ) {
			setSuccessesError(null)
		} else {
			setSuccessesError("Successes must be a positive integer less than or equal to the number of trials.")
		}
	}

	const handleTrials = e => {
		let input = e.target.value
		setTrials(input)
		let n = parseFloat(input)
		if (Number.isInteger(n) && n >= successes) {
			setTrialsError(null)
		} else {
			setTrialsError("Trials must be a nonnegative integer greater than or equal to the number of successes.")
		}
	}

	const handleProb = e => {
		let input = e.target.value
		setProb(input)
		if (Number.isInteger(parseFloat(input))) {
			setProbError(null)
		} else {
			setProbError("Probability must be a nonnegative integer.")
		}
	}

	const handleProbs = i => setProbs(i)

	const handleAlt = i => setAlt(i)

	const handleVarEqual = i => setVarEqual(i)

	const handleTrueMean = e => {
		let input = e.target.value
		setTrueMean(input)
		if (isNaN(parseFloat(input))) {
			setTrueMeanError("True mean must be a number.")
		} else {
			setTrueMeanError(null)
		}
	}

	// const handlePaired = () => setPaired(!paired)

	const handleConfidenceLevel = e => {
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

	const handleCorrect = () => setCorrect(!correct)

	const handleMatrix = newSelectedVariables => setMatrix(newSelectedVariables)

	const handleCorr = i => setCorr(i)

	const handleSubmit = e => {
		const formuladata = e
		// if ()
		const { datas, data } = slides
		doRegress(formuladata, "fishertest").then(res => {
			delete formuladata.slides
			delete formuladata.names
			const statName = statistic + ' ' + getMaxNumberCustomSheet(datas.map(d => d.name), statistic)
			res.name = statName
			res.type = "regression"
			res.regression = formuladata
			const d = slides.insertData(dataNames, current, res, key)
			onSetDataNames([
				...dataNames.slice(0, current+1),
				d.name,
				...dataNames.slice(current+1)
			])
			onSetCurrent(current+1)
			onSetRightSidebar('none')
			data = d
		}).catch(err => setError(err.toString()))
	}

	const isInvalid = variables.length < 1
		|| formulaError !== null
		|| formulaError2 !== null
		|| trueMeanError !== null
		|| confidenceLevelError !== null
		|| successesError !== null
		|| trialsError !== null
		|| probError !== null

	return (
		<Form
			statistic={statistic}
			invalidStat={isInvalid}
			setVariables={setVariables}
			onSubmit={handleSubmit}
			error={error}
			setError={setError}
		>
			{statistics[statistic].arguments.includes("oneWayAnova") &&
				<Anova
					variables={variables}
					on={handleOneWayAnova}
				/>}
			{statistics[statistic].arguments.includes("randomizedBlockDesign") &&
				<Anova
					variables={variables}
					onChange={handleRandomizedBlockDesign}
					hasBlocks={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayAnova") &&
				<Anova
					variables={variables}
					onChange={handleTwoWayAnova}
					hasIndependent2={true}
				/>}
			{statistics[statistic].arguments.includes("analysisOfCovariance") &&
				<Anova
					variables={variables}
					onChange={handleAnalysisOfCovariance}
					hasCovariate={true}
				/>}
			{statistics[statistic].arguments.includes("oneWayWithin") &&
				<Anova
					variables={variables}
					onChange={handleOneWayWithin}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayWithin") &&
				<Anova
					variables={variables}
					onChange={handleTwoWayWithin}
					hasIndependent2={true}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayBetween") &&
				<Anova
					variables={variables}
					onChange={handleTwoWayBetween}
					hasIndependent2={true}
					hasSubject={true}
					hasBetween={true}
				/>}
			{statistics[statistic].arguments.includes("oneWayManova") &&
				<Manova
					variables={variables}
					onChange={handleOneWayManova}
				/>}
			{statistics[statistic].arguments.includes("randomizedBlockDesignManova") &&
				<Manova
					variables={variables}
					onChange={handleRandomizedBlockDesignManova}
					hasBlocks={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayManova") &&
				<Manova
					variables={variables}
					onChange={handleTwoWayManova}
					hasIndependent2={true}
				/>}
			{statistics[statistic].arguments.includes("mancova") &&
				<Manova
					variables={variables}
					onChange={handleAncova}
					hasCovariate={true}
				/>}
			{statistics[statistic].arguments.includes("oneWayWithinManova") &&
				<Manova
					variables={variables}
					onChange={handleOneWayWithinManova}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayWithinManova") &&
				<Manova
					variables={variables}
					onChange={handleTwoWayWithinManova}
					hasIndependent2={true}
					hasSubject={true}
				/>}
			{statistics[statistic].arguments.includes("twoWayBetweenManova") &&
				<Manova
					variables={variables}
					onChange={handleTwoWayBetweenManova}
					hasIndependent2={true}
					hasSubject={true}
					hasBetween={true}
				/>}
			{statistics[statistic].arguments.includes("multipleLinearRegression") &&
				<MultipleLinearRegression
					text='Linear model'
					variables={variables}
					onChange={handleMultipleLinearRegressionVars}
				/>}
			{statistics[statistic].arguments.includes("multipleLinearRegression2") &&
				<MultipleLinearRegression
					text='Linear model 2'
					variables={variables}
					onChange={handleMultipleLinearRegressionVars2}
				/>}
	    {statistics[statistic].arguments.includes("formula") &&
	      <Formula
					formulaText={formulaText}
					variables={variables}
					onSetFormula={handleFormula}
					formulaError={formulaError}
				/>}
			{statistics[statistic].arguments.includes("formula2") &&
				<Formula
					formulaText={formulaText2}
					variables={variables}
					onSetFormula={handleFormula2}
					formulaError={formulaError2}
				/>}
			{/*}{statistics[statistic].arguments.includes("family") &&
				<Variable
					label="X variable"
					onChange={handleFamily}
					options={FAMILY_OBJECTS}
					name={FAMILY_OBJECTS[family]}
				/>}*/}
	    {statistics[statistic].arguments.includes("xvariable") &&
				<Variable
					label="X variable"
					onChange={handleVariableX}
					options={variables}
					name={variables[variableX]}
				/>}
      {statistics[statistic].arguments.includes("yvariable") &&
      	<Variable
					label="Y variable"
					onChange={handleVariableY}
					options={variables}
					name={variables[variableY]}
				/>}
			{statistics[statistic].arguments.includes("zvariable") &&
				<Variable
					label="Z variable"
					onChange={handleVariableZ}
					options={variables}
					name={variables[variableZ]}
				/>}
			{statistics[statistic].arguments.includes("groups") &&
	       <Variable
					label="Grouping factor"
					onChange={handleGroups}
					options={variables}
					name={variables[groups]}
				/>}
			{statistics[statistic].arguments.includes("blocks") &&
			 	<Variable
					label="Blocking factor"
					onChange={handleBlocks}
					options={variables}
					name={variables[blocks]}
				/>}
			{statistics[statistic].arguments.includes("padj") &&
			 	<Variable
					label="Adjustment Method"
					onChange={handlePadj}
					options={P_ADJUST}
					name={P_ADJUST[padj]}
				/>}
			{statistics[statistic].arguments.includes("successes") &&
				<Number
					label='Number of successes'
					value={successes}
					onChange={handleSuccesses}
					error={successesError}
				/>}
			{statistics[statistic].arguments.includes("trials") &&
				<Number
					label='Number of trials'
					value={trials}
					onChange={handleTrials}
					error={trialsError}
				/>}
			{statistics[statistic].arguments.includes("prob") &&
				<Number
					label='Probability of success'
					value={prob}
					onChange={handleProb}
					error={probError}
				/>}
			{statistics[statistic].arguments.includes("probs") &&
				<Variable
					label="Probabilities"
					onChange={handleProbs}
					options={variables}
					name={variables[probs]}
				/>}
	    {statistics[statistic].arguments.includes("alt") &&
	      <Variable
					label="Alternative"
					onChange={handleAlt}
					options={ALTERNATIVES}
					name={ALTERNATIVES[alt]}
				/>}
			{statistics[statistic].arguments.includes("varEqual") &&
				<Variable
					label="Equal variance or pooled variance"
					onChange={handleVarEqual}
					options={VAR_EQUAL}
					name={VAR_EQUAL[varEqual]}
				/>}
	    {statistics[statistic].arguments.includes("mu") &&
				<Number
					label='True value of the mean (difference in means)'
					value={trueMean}
					onChange={handleTrueMean}
					error={trueMeanError}
				/>}
	    {/*{statistics[statistic].arguments.includes("paired") &&
	      <input
					type="checkbox"
					name="paired"
					value={paired}
					onChange={handlePaired}
				/>}*/}
	    {statistics[statistic].arguments.includes("conf") &&
				<Number
					label='Confidence level'
					value={confidenceLevel}
					onChange={handleConfidenceLevel}
					error={confidenceLevelError}
				/>}
			{statistics[statistic].arguments.includes("correct") &&
				<Button
					onClick={handleCorrect}
					condition={correct}
					text='Continuity correction'
				/>}
			{statistics[statistic].arguments.includes("matrix") &&
				<Matrix
					variables={variables}
					selectedVariables={matrix}
					setSelectedVariables={handleMatrix}
				/>}
			{statistics[statistic].arguments.includes("corr") &&
				<Variable
					label="Type of correlation"
					onChange={handleCorr}
					options={CORRELATION_TYPE}
					name={CORRELATION_TYPE[corr]}
				/>}
  	</Form>
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
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(Statistics)
