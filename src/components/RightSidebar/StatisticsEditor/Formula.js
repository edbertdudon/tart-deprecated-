import React from 'react'
import withFormula from './withFormula'
import { readableFormula } from './functions'

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
