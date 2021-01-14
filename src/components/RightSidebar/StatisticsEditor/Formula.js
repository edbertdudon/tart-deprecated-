import React from 'react'
import withFormula from './withFormula'

const OPERATORS_REGEX = /\+|\~/g

function readableFormula(formula) {
  if (formula == "") return "y = b0 + b1X"
  let formulaAsArray = formula.split(OPERATORS_REGEX)
  let newFormula = formulaAsArray[0] + " = b0"
  for (let i=1; i<formulaAsArray.length; i++) {
    let nextVar = " + " + "b"+ i + formulaAsArray[i]
    newFormula = newFormula.concat(nextVar)
  }
  return newFormula
}

const Formula = ({ formulaText, variables, onSetFormula, formulaError}) =>
	<div className='rightsidebar-formula'>
		<div className='rightsidebar-label'>Linear model</div>
		<div>{readableFormula(formulaText)}</div>
		<OptionsWithFormula
			options={variables}
			onSetFormula={onSetFormula}
		/>
		<div className='rightsidebar-subtext'>Use I() for transformations involving +, -, *, or ^. e.g. y ~ x + I(x^2)</div>
		{formulaError && <p>{formulaError}</p>}
	</div>


const Options = ({ option }) => option
const OptionsWithFormula = withFormula(Options)

export default Formula
