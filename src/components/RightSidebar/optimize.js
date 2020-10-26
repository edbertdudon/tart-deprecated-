import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiLoading, mdiClose } from '@mdi/js'

import Variable from './StatisticsEditor/Variable'
import withListsDropdown from './withListsDropdown'
import withLists from './withLists'
import { columnToLetter, spreadsheetToR, translateR } from '../Spreadsheet/cloudr'
import { withFirebase } from '../Firebase'

const OBJECTIVE_CLASS = [
	"General nonlinear optimization",
	"Linear programming",
	// "Quadratic programming",
]

const OPTIMIZATION_METHODS = [
	'Nelder-mead',
	'L-BFGS-B',
	'BFGS',
	'CG',
	'nlm',
	'nlminb',
	'spg',
	'ucminf',
	'newuoa',
	'bobyqa',
	'nmkb',
	'hjkb',
	'Rcgmin',
	'Rvmmin'
]

const MIN_MAX = [
	"minimum",
	"maximum"
]

const Optimize = ({ firebase, slides, authUser, color, setRightSidebar }) => {
	const [objective, setObjective] = useState('')
	const [quadraticLinearObjective, setQuadraticLinearObjective] = useState('')
	const [objectiveClass, setObjectiveClass] = useState(0)
	const [parameter, setParameter] = useState('')
	const [constraintsLhs, setConstraintsLhs] = useState('')
	const [constraintsDir, setConstraintsDir] = useState('')
	const [constraintsRhs, setConstraintsRhs] = useState('')
	// const [methods, setMethods] = useState(0)
	const [minMax, setMinMax] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		setObjective(columnToLetter(slides.data.selector.ci+1) + (slides.data.selector.ri+1))
	}, [])

	const handleUpdateObjective = e => setObjective(e.target.value)

	const handleUpdateQuadraticLinearObjective = e => setQuadraticLinearObjective(e.target.value)

	const handleUpdateObjectiveClass = activeOption => setObjectiveClass(activeOption)

	const handleUpdateParameter = e => setParameter(e.target.value)

	const handleUpdateConstraintsLhs = e => {
		setConstraintsLhs(e.target.value)
		// changeDefaultMethod(e.target.value)
	}

	const handleUpdateConstraintsDir = e => {
		setConstraintsDir(e.target.value)
		// changeDefaultMethod(e.target.value)
	}

	const handleUpdateConstraintsRhs = e => {
		setConstraintsRhs(e.target.value)
		// changeDefaultMethod(e.target.value)
	}

	// const changeDefaultMethod = (e) => {
	// 	if (methods == 0 && e.length > 0) {
	// 		setMethods(1)
	// 	}
	// }

	// const handleUpdateMethods = activeOption => setMethods(activeOption)

	const handleUpdateMinMax = activeOption => setMinMax(activeOption)

	const handleSubmit = () => {
		setLoading(true)
		let name = slides.data.name
		let sparkData = {
			objective: translateR(objective, name),
			quadraticLinearObjective: translateR(quadraticLinearObjective || 'na', name),
			objectiveClass: OBJECTIVE_CLASS[objectiveClass],
			parametersString: translateR(parameter, name),
			constraintsLhs: translateR(constraintsLhs || 'na', name),
			constraintsDir: translateR(constraintsDir || 'na', name),
			constraintsRhs: translateR(constraintsRhs || 'na', name),
			isMaximum: MIN_MAX[minMax],
		}
		let optimizationData = {
			...sparkData,
			slides: JSON.stringify(spreadsheetToR(slides.datas)),
			names: JSON.stringify(slides.datas.map(data => data.name))
		}
		// firebase.doOptimization(optimizationData)
		// 	.then(res => {
		// 		if (typeof res[0] === "string" || res[0] instanceof String) {
		// 			setError(res)
		// 			setLoading(false)
		// 		} else {
		// 			dispatchSlides({function:'OPTIMIZE', data: jsonToSlides(res), optimization: sparkData, type:"optimize"})
		// 	        setCurrentSlide(currentSlide+1)
		// 			setRightSidebar('none')
		// 			setLoading(false)
		// 		}
		// 	})
	}

	const handleClose = () => {
		setRightSidebar('none')
		setLoading(false)
	}

	const isInvalid = objective === '' || parameter === ''

	return (
		<>
			<button className='rightsidebar-close' onClick={handleClose}>
				<Icon path={mdiClose} size={1}/>
			</button>
			<div className='rightsidebar-heading'>Optimize</div>
			<div className='rightsidebar-label'>Objective</div>
			{objectiveClass === 2 &&
				<div className='rightsidebar-label'>coefficients of the quadratic term in matrix form</div>
			}
			<input
				type="text"
				className='rightsidebar-input'
				onChange={handleUpdateObjective}
				value={objective}
			/>
			{objectiveClass === 2 &&
				<>
					<div className='rightsidebar-label'>coefficients of the linear term in matrix form (optional)</div>
					<input
						type="text"
						className='rightsidebar-input'
						onChange={handleUpdateQuadraticLinearObjective}
						value={quadraticLinearObjective}
					/>
				</>
			}
			<Variable
				label="Minimum/Maximum"
				onChange={handleUpdateMinMax}
				options={MIN_MAX}
				name={MIN_MAX[minMax]}
			/>
			<div className='rightsidebar-label'>Decision variables</div>
			<input
				type="text"
				className='rightsidebar-input'
				onChange={handleUpdateParameter}
				value={parameter}
			/>
			<div className='rightsidebar-label'>Constraints left hand side</div>
			<input
				type="text"
				className='rightsidebar-input'
				onChange={handleUpdateConstraintsLhs}
				value={constraintsLhs}
			/>
			<div className='rightsidebar-label'>{'Constraints direction =, <=, or >='}</div>
			<input
				type="text"
				className='rightsidebar-input'
				onChange={handleUpdateConstraintsDir}
				value={constraintsDir}
			/>
			<div className='rightsidebar-label'>Constraints right hand side (numeric only)</div>
			<input
				type="text"
				className='rightsidebar-input'
				onChange={handleUpdateConstraintsRhs}
				value={constraintsRhs}
			/>
			<Variable
				label="Objective function type"
				onChange={handleUpdateObjectiveClass}
				options={OBJECTIVE_CLASS}
				name={OBJECTIVE_CLASS[objectiveClass]}
			/>
			{/*{objectiveClass === 0 && <>
				<div className='rightsidebar-label'>Methods</div>
				<Variable
					label="Method"
					onChange={handleUpdateMethods}
					options={OPTIMIZATION_METHODS}
					name={OPTIMIZATION_METHODS[methods]}
				/>
				{/*{methods.map((method, index) => (
					<OptionsWithListsDropdown
						onChange={handleUpdateMethods}
						options={OPTIMIZATION_METHODS}
						name={OPTIMIZATION_METHODS[method]}
						selection={methods}
						setSelection={setMethods}
						currentSelection={index}
					/>))}
				<OptionsWithLists
					onChange={handleAddMethod}
					options={OPTIMIZATION_METHODS}
					name={methods.length < 1 ? '' : 'Add additonal method'}
					styles={{color: "#aaa"}}
				/>
				</>}*/}
			<div className='rightsidebar-text'>{error && <p>{error}</p>}</div>
			{loading
				?	<div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin/></div>
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
	slides: (state.slidesState.slides || {}),
	color: (state.colorState.colors || {}),
});

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)
const OptionsWithListsDropdown = withListsDropdown(Options)

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
	),
)(Optimize)
