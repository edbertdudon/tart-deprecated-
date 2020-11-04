//
//  Optimize
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiLoading, mdiClose } from '@mdi/js'

import General from './general'
import Linear from './linear'
import Quadratic from './quadratic'
import Constraints from './constraints'
import Variable from '../StatisticsEditor/Variable'
import withListsDropdown from '../withListsDropdown'
import withLists from '../withLists'
import { columnToLetter, spreadsheetToR, translateR } from '../../Spreadsheet/cloudr'
import { withFirebase } from '../../Firebase'

const OBJECTIVE_CLASS = [
	"General nonlinear optimization",
	"Linear programming",
	"Quadratic programming",
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
	const [quadratic, setQuadratic] = useState('')
	const [linear, setLinear] = useState('')
	const [gradient, setGradient] = useState('')
	const [hessian, setHessian] = useState('')
	const [minMax, setMinMax] = useState(0)
	const [objectiveClass, setObjectiveClass] = useState(0)
	const [decision, setDecision] = useState('')
	const [lhs, setLhs] = useState('')
	const [dir, setDir] = useState('')
	const [rhs, setRhs] = useState('')
	const [jacobian, setJacobian] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	// useEffect(() => {
	// 	setObjective(columnToLetter(slides.data.selector.ci+1) + (slides.data.selector.ri+1))
	// }, [])

	const handleUpdateObjectiveClass = activeOption => setObjectiveClass(activeOption)

	const handleMinimize = () => setMinMax(0)

	const handleMaximize = () => setMinMax(1)

	const handleSubmit = () => {
		setLoading(true)
		let name = slides.data.name
		let sparkData = {
			objective: translateR(objective || 'na', name),
			parametersString: translateR(decision || 'na', name),
			quadratic: translateR(quadratic || 'na', name),
			linear: translateR(linear || 'na', name),
			gradient: translateR(gradient || 'na', name),
			hessian: translateR(hessian || 'na', name),
			objectiveClass: OBJECTIVE_CLASS[objectiveClass],
			lhs: translateR(lhs || 'na', name),
			dir: translateR(dir || 'na', name),
			rhs: translateR(rhs || 'na', name),
			isMaximum: MIN_MAX[minMax],
		}
		let optimizationData = {
			...sparkData,
			slides: JSON.stringify(spreadsheetToR(slides.datas)),
			names: JSON.stringify(slides.datas.map(data => data.name))
		}
		console.log(sparkData)
		console.log(JSON.stringify(spreadsheetToR(slides.datas)))
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

	const isInvalid = {
		0: objective === '' || decision === '',
		1: quadratic === '',
		2: linear === '',
	}

	const OBJECTIVE_STATES = {
		0: <General
			objective={objective}
			setObjective={setObjective}
			decision={decision}
			setDecision={setDecision}
			gradient={gradient}
			setGradient={setGradient}
			hessian={hessian}
			setHessian={setHessian}
		/>,
		1: <Linear
			linear={linear}
			setLinear={setLinear}
		/>,
		2: <Quadratic
			quadratic={quadratic}
			setQuadratic={setQuadratic}
			linear={linear}
			setLinear={setLinear}
		/>
	}

	return (
		<>
			<button className='rightsidebar-close' onClick={handleClose}>
				<Icon path={mdiClose} size={1}/>
			</button>
			<div className='rightsidebar-heading'>Optimize</div>
			<div className='rightsidebar-label'>Objective</div>
			{
				OBJECTIVE_STATES[objectiveClass]
			}
			<Variable
				label="Objective function type"
				onChange={handleUpdateObjectiveClass}
				options={OBJECTIVE_CLASS}
				name={OBJECTIVE_CLASS[objectiveClass]}
			/>
			<button
				className='rightsidebar-button'
				style={{
					backgroundColor: minMax === 0 && color[authUser.uid],
					boxShadow: minMax === 0 ? 'inset 0px 0px 0px 3px #fff' : 'none',
          border: minMax === 0 ? '1px solid '+ color[authUser.uid] : 'none'
				}}
				onClick={handleMinimize}
			></button>
			<div className='rightsidebar-buttontext'>Minimum</div>
			<button
				className='rightsidebar-button'
				style={{
					backgroundColor: minMax === 1 && color[authUser.uid],
					boxShadow: minMax === 1 ? 'inset 0px 0px 0px 3px #fff' : 'none',
          border: minMax === 1 ? '1px solid '+ color[authUser.uid] : 'none'
				}}
				onClick={handleMaximize}
			></button>
			<div className='rightsidebar-buttontext'>Maximum</div>
			<Constraints
				lhs={lhs}
				setLhs={setLhs}
				dir={dir}
				setDir={setDir}
				rhs={rhs}
				setRhs={setRhs}
				jacobian={jacobian}
				setJacobian={setJacobian}
			/>
			<div className='rightsidebar-text'>{error && <p>{error}</p>}</div>
			{loading
				?	<div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin/></div>
				: <input
						disabled={isInvalid[objectiveClass]}
						type="submit"
						style={{ color : isInvalid[objectiveClass] ? "rgb(0, 0, 0, 0.5)" : color[authUser.uid]}}
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
