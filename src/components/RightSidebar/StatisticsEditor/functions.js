import { spreadsheetToR } from '../../Spreadsheet/cloudr'

export function setFormula(slides, formula) {
	const current = slides.bottombar.dataNames.indexOf(slides.data.name)
	return {
		formulatext: formula,
		name: slides.datas[current].name,
		slides: JSON.stringify(spreadsheetToR(slides.datas)),
		names: JSON.stringify(slides.bottombar.dataNames)
	}
}

export function setSparkData(slides, formula) {
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

export function setStatisticalFunciton(
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

export function cbindDependents(dependents, variables) {
	let stringDependents = 'cbind(`' + variables[dependents[0]] + '`'
	for (var i=1; i<dependents.length; i++) {
		stringDependents = stringDependents + ',`' + variables[dependents[i]] + '`'
	}

	stringDependents = stringDependents + ')'
	return stringDependents
}

const OPERATORS_REGEX = /\+|\~/g

export function readableFormula(formula) {
  if (formula == "") return "y = b0 + b1X"
  let formulaAsArray = formula.split(OPERATORS_REGEX)
  let newFormula = formulaAsArray[0] + " = b0"
  for (var i=1; i<formulaAsArray.length; i++) {
    let nextVar = " + " + "b"+ i + formulaAsArray[i]
    newFormula = newFormula.concat(nextVar)
  }
  return newFormula
}
