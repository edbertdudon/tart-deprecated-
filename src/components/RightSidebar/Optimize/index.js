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
import Bounds from './bounds'
import Fconstraint from './fconstraint'
import Cconstraint from './cconstraint'
import Qconstraint from './qconstraint'
import Lconstraint from './lconstraint'
import Variable from '../StatisticsEditor/Variable'
import withListsDropdown from '../withListsDropdown'
import withLists from '../withLists'
import { letterToColumn, columnToLetter, spreadsheetToR, doOptimization, translateR } from '../../Spreadsheet/cloudr'
import { withFirebase } from '../../Firebase'

const OBJECTIVE_CLASS = ["General nonlinear optimization", "Linear programming", "Quadratic programming"]

const CONSTRAINTS_TYPE = [
	"General form constraints (default)",
	"Bounds",
	"Linear constraints",
	"Quadratic constraints",
	"Zero cone",
	"Linear cone",
	"Second-order cone",
	"Exponential cone",
	"3-dimensional primal power cone",
	"2-dimensional primal power cone",
	"Positive semidefinite cone",
]

const CONES_TYPE = ["K_zero", "K_lin", "K_soc", "K_expp", "K_powp", "K_powd", "K_psd"]

const SOLVER_STATES = [
	// General
	["optimx", "nloptr.lbfgs"],
	// Linear
	["lpsolve", "glpk"],
	// Quadratic
	["quadprog", "qpoases"],
]

const SOLVER_CONSTRAINTS = [
	// General
	["nloptr.lbfgs"],
	// Bound
	["optimx"],
	// Linear
	["lpsolve", "glpk", "quadprog", "qpoases"],
	// Qudaratic
	[],
	// Zero cone
	[],
	// Linear cone
	[],
	// Second-order cone
	[],
	// Exponential cone
	[],
	// 3-dimensional primal power cone
	[],
	// 2-dimensional primal power cone
	[],
	// Positive semidefinite cone
	[],
]

const OPTIMX_METHODS = [
  'Nelder-mead', 'L-BFGS-B', 'BFGS', 'CG', 'nlm', 'nlminb', 'spg', 'ucminf', 'newuoa', 'bobyqa', 'nmkb', 'hjkb', 'Rcgmin', 'Rvmmin'
]

var VALID_RANGE_REFERENCES = /^\$?[A-Z]+\$?[0-9]*\:{1}\$?[A-Z]+\$?[0-9]*$/
var VALID_FORMULA_CELL_REFERENCES = /^\$?[A-Z]+\$?[0-9]*$/;
var RANGE_REFERENCES = /\$?[A-Z]+\$?[0-9]*\:{1}\$?[A-Z]+\$?[0-9]*/g;
var FORMULA_CELL_REFERENCES = /\$?[A-Z]+\$?[0-9]*/g;
var LETTERS_REFERENCE = /\$?[A-Z]+/g;
var NUMBERS_REFERENCE = /\$?[0-9]+/g;

const validateCell = v => {
	if (!VALID_FORMULA_CELL_REFERENCES.test(v)) {
		return("Invalid cell reference.")
	}
  const mr = v.match(RANGE_REFERENCES)
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map(ref => letterToColumn(ref))
    const mn = v.match(NUMBERS_REFERENCE).map(ref => parseInt(ref))
    if (ml[1] < ml[0] || mn[1] < mn[0] || ml.length !== 1 || mn.length !== 1) {
      return("Invalid range.")
    }
  }
  return(null)
}

export const updateCell = (e, setLhs, setError) => {
	const v = e.target.value
	setLhs(v)
	setError(validateCell(v))
}

const validateCellorSingleRange = v => {
	if (!(VALID_FORMULA_CELL_REFERENCES.test(v) || VALID_RANGE_REFERENCES.test(v))) {
		return("Invalid cell, row or column.")
	}
	const mc = v.match(FORMULA_CELL_REFERENCES)
	if (mc === null) {
		return("Invalid cell.")
	}
	const mr = v.match(RANGE_REFERENCES)
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE)
    const mn = v.match(NUMBERS_REFERENCE)
		if (!(ml[1] == ml[0] || mn[1] == mn[0]) || ml.length > 2 || mn.length > 2) {
      return("Invalid row or column. Must be limited to a single row or column")
    }
  }
  return(null)
}

export const updateCellorSingleRange = (e, setLhs, setError) => {
	const v = e.target.value
	setLhs(v)
	setError(validateCellorSingleRange(v))
}

const validateRange = v => {
	if (!VALID_RANGE_REFERENCES.test(v)) {
		return("Invalid range reference.")
	}
	const mc = v.match(FORMULA_CELL_REFERENCES)
  if (mc === null) {
    return("Invalid cell.")
  }
  const mr = v.match(RANGE_REFERENCES)
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map(ref => letterToColumn(ref))
    const mn = v.match(NUMBERS_REFERENCE).map(ref => parseInt(ref))
    if (ml[1] < ml[0] || mn[1] < mn[0] || ml.length !== 2 || mn.length !== 2) {
      return("Invalid range.")
    }
  }
  return(null)
}

export const updateRange = (e, setLhs, setError) => {
	const v = e.target.value
	setLhs(v)
	setError(validateRange(v))
}

const validateRangeNotOne = v => {
	if (!VALID_RANGE_REFERENCES.test(v)) {
		return("Invalid range reference.")
	}
	const mc = v.match(FORMULA_CELL_REFERENCES)
  if (mc === null) {
    return("Invalid cell.")
  }
  const mr = v.match(RANGE_REFERENCES)
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map(ref => letterToColumn(ref))
    const mn = v.match(NUMBERS_REFERENCE).map(ref => parseInt(ref))
    if (ml[1] <= ml[0] || mn[1] <= mn[0] || ml.length !== 2 || mn.length !== 2) {
      return("Invalid range. Must be greater than a single row or column")
    }
  }
  return(null)
}

export const updateRangeNotOne = (e, setLhs, setError) => {
	const v = e.target.value
	setLhs(v)
	setError(validateRange(v))
}

const validateCellorRange = v => {
	if (!(VALID_FORMULA_CELL_REFERENCES.test(v) || VALID_RANGE_REFERENCES.test(v))) {
		return("Invalid cell reference.")
	}
	const mc = v.match(FORMULA_CELL_REFERENCES)
  if (mc === null) {
    return("Invalid cell.")
  }
  const mr = v.match(RANGE_REFERENCES)
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map(ref => letterToColumn(ref))
    const mn = v.match(NUMBERS_REFERENCE).map(ref => parseInt(ref))
    if (ml[1] < ml[0] || mn[1] < mn[0] || ml.length > 2 || mn.length > 2) {
      return("Invalid range.")
    }
  }
  return(null)
}

export const updateCellorRange = (e, setLhs, setError) => {
	const v = e.target.value
	setLhs(v)
	setError(validateCellorRange(v))
}

// export const validateCellText = (v, slides, check) => {
// 	if (!(VALID_FORMULA_CELL_REFERENCES.test(v) || VALID_RANGE_REFERENCES.test(v))) {
// 		return("Invalid cell reference.")
// 	}
//   const mc = v.match(FORMULA_CELL_REFERENCES)
//   if (mc === null) {
//     return("Invalid cell.")
//   }
//   const mr = v.match(RANGE_REFERENCES)
//   if (mr !== null) {
//     const ml = v.match(LETTERS_REFERENCE).map(ref => letterToColumn(ref))
//     const mn = v.match(NUMBERS_REFERENCE).map(ref => parseInt(ref))
//     if (ml[1] < ml[0] || mn[1] < mn[0] || ml.length > 2 || mn.length > 2) {
//       return("Invalid range.")
//     }
//     for (var i=mn[0]-1; i<mn[1]; i++) {
//       for (var j=ml[0]-1; j<ml[1]; j++) {
//         const cellText = check(slides.data.getCellTextOrDefault(i,j))
// 				if (cellText != undefined) {
// 	        return(cellText)
// 				}
//       }
//     }
//   }
//   return(null)
// }

// export const updateDir = (e, setDir, setError) => {
// 	const v = e.target.value
// 	setDir(v)
// 	setError(validateCellorRange(v))
// 	// setError(
// 	//   validateCellText(v, slides, (cellText) => {
// 	//     if (cellText !== "=" && cellText !== "<=" && cellText !== ">=") {
// 	//       return("Direction must be =, <= or >=.")
// 	//     }
// 	//   })
// 	// )
// }
//
// export const updateRhs = (e, setRhs, setError) => {
// 	const v = e.target.value
// 	setRhs(v)
// 	setError(validateCellorRange(v))
// 	// setError(
// 	//   validateCellText(v, slides, (cellText) => {
// 	//     if (isNaN(cellText)) {
// 	//       return("Range must be numeric.")
// 	//     }
// 	//   })
// 	// )
// }

const Optimize = ({ firebase, slides, authUser, color, dataNames, current, onSetDataNames, onSetCurrent, onSetRightSidebar }) => {
	const [objective, setObjective] = useState('')
	const [quadratic, setQuadratic] = useState('')
	const [linear, setLinear] = useState('')
	const [gradient, setGradient] = useState('')
	const [hessian, setHessian] = useState('')
	const [minMax, setMinMax] = useState(0)
	const [objectiveClass, setObjectiveClass] = useState(0)
	const [decision, setDecision] = useState('')
	const [constraints, setConstraints] = useState(CONSTRAINTS_TYPE)
	// General constraints
	const [flhs, setFlhs] = useState('')
	const [fdir, setFdir] = useState('')
	const [frhs, setFrhs] = useState('')
	const [jacobian, setJacobian] = useState('')
	// Bounds
	const [blhs, setBlhs] = useState('')
	const [bdir, setBdir] = useState('')
	const [brhs, setBrhs] = useState('')
	const [li, setLi] = useState('')
	const [lb, setLb] = useState('')
	const [ui, setUi] = useState('')
	const [ub, setUb] = useState('')
	const [ld, setLd] = useState('')
	const [ud, setUd] = useState('')
	// Quadratic constraints
	const [qquad, setQquad] = useState('')
	const [qlin, setQlin] = useState('')
	const [qdir, setQdir] = useState('')
	const [qrhs, setQrhs] = useState('')
	// Linear constraints
	const [llin, setLlin] = useState('')
	const [ldir, setLdir] = useState('')
	const [lrhs, setLrhs] = useState('')
	// Zero cone
	const [c0lhs, setC0lhs] = useState('')
	const [c0cone, setC0cone] = useState(1)
	const [c0rhs, setC0rhs] = useState('')
	// Linear cone
	const [cllhs, setCllhs] = useState('')
	const [lcone, setlcone] = useState(1)
	const [clrhs, setClrhs] = useState('')
	// Second-order cone
	const [csolhs, setCsolhs] = useState('')
	const [socone, setSocone] = useState(1)
	const [csorhs, setCsorhs] = useState('')
	// Exponential cone
	const [cexlhs, setCexlhs] = useState('')
	const [excone, setExcone] = useState(1)
	const [cexrhs, setCexrhs] = useState('')
	// Power 3d cone
	const [cpplhs, setCpplhs] = useState('')
	const [ppcone, setPpcone] = useState(0.5)
	const [cpprhs, setCpprhs] = useState('')
	// Power 2d cone
	const [cpdlhs, setCpdlhs] = useState('')
	const [pdcone, setPdcone] = useState(0.5)
	const [cpdrhs, setCpdrhs] = useState('')
	// Positive semidefinite cone
	const [cpsdlhs, setCpsdlhs] = useState('')
	const [psdcone, setPsdcone] = useState(1)
	const [cpsdrhs, setCpsdrhs] = useState('')
	const [solver, setSolver] = useState(0)
	const [loading, setLoading] = useState(false)
	// Errors
	const [error, setError] = useState(null)
	const [errorGeneral, setErrorGeneral] = useState(null)
	const [errorQuadratic, setErrorQuadratic] = useState(null)
	const [errorLinear, setErrorLinear] = useState(null)
	const [errorBounds, setErrorBounds] = useState(null)
	const [errorGconstraint, setErrorGconstraint] = useState(null)
	const [errorQconstraint, setErrorQconstraint] = useState(null)
	const [errorLconstraint, setErrorLconstraint] = useState(null)
	const [error0cone, setError0cone] = useState(null)
	const [errorLcone, setErrorLcone] = useState(null)
	const [errorSocone, setErrorSocone] = useState(null)
	const [errorEcone, setErrorEcone] = useState(null)
	const [error3cone, setError3cone] = useState(null)
	const [error2cone, setError2cone] = useState(null)
	const [errorPsdcone, setErrorPsdcone] = useState(null)

	useEffect(() => {
		const { selector } = slides.sheet
		const {
			sri, sci, eri, eci,
		} = selector.range;
		setObjective(columnToLetter(sci+1) + (sri+1))
	}, [])

	const handleUpdateObjectiveClass = i => setObjectiveClass(i)

	const handleMinimize = () => setMinMax(0)

	const handleMaximize = () => setMinMax(1)

	const handleAddConstraint = i =>
		setConstraints(constraints.filter(constraint => constraint !== constraints[i]))

	const handleRemoveConstraint = index => setConstraints(
		constraints.map(c => CONSTRAINTS_TYPE.indexOf(c))
			.concat(index)
			.sort((a,b) => a-b)
			.map(c => CONSTRAINTS_TYPE[c])
	)

	const handleUpdateSolver = i => setSolver(i)

	const handleSubmit = () => {
		setLoading(true)
		const { name } = slides.data
		let sparkData = {
			objective: translateR(objective || 'na', name),
			quadratic: translateR(quadratic || 'na', name),
			linear: translateR(linear || 'na', name),
			gradient: translateR(gradient || 'na', name),
			hessian: translateR(hessian || 'na', name),
			minmax: minMax,
			decision: translateR(decision || 'na', name),
			flhs: translateR(flhs || 'na', name),
			fdir: translateR(fdir || 'na', name),
			frhs: translateR(frhs || 'na', name),
			jacobian: translateR(jacobian || 'na', name),
			blhs: translateR(blhs || 'na', name),
			bdir: translateR(bdir || 'na', name),
			brhs: translateR(brhs || 'na', name),
			lowerindex: translateR(li || 'na', name),
			lowerbound: translateR(lb || 'na', name),
			upperindex: translateR(ui || 'na', name),
			upperbound: translateR(ub || 'na', name),
			lowerlimit: translateR(ld || 'na', name),
			upperlimit: translateR(ud || 'na', name),
			qquad: translateR(qquad || 'na', name),
			qlin: translateR(qlin || 'na', name),
			qdir: translateR(qdir || 'na', name),
			qrhs: translateR(qrhs || 'na', name),
			llin: translateR(llin || 'na', name),
			ldir: translateR(ldir || 'na', name),
			lrhs: translateR(lrhs || 'na', name),
			c0lhs: translateR(c0lhs || 'na', name),
			c0cone: c0cone || 'na',
			c0rhs: translateR(c0rhs || 'na', name),
			cllhs: translateR(cllhs || 'na', name),
			lcone: lcone || 'na',
			clrhs: translateR(clrhs || 'na', name),
			csolhs: translateR(csolhs || 'na', name),
			socone: socone || 'na',
			csorhs: translateR(csorhs || 'na', name),
			cexlhs: translateR(cexlhs || 'na', name),
			excone: excone || 'na',
			cexrhs: translateR(cexrhs || 'na', name),
			cpplhs: translateR(cpplhs || 'na', name),
			ppcone: ppcone || 'na',
			cpprhs: translateR(cpprhs || 'na', name),
			cpdlhs: translateR(cpdlhs || 'na', name),
			pdcone: pdcone || 'na',
			cpdrhs: translateR(cpdrhs || 'na', name),
			cpsdlhs: translateR(cpsdlhs || 'na', name),
			psdcone: psdcone || 'na',
			cpsdrhs: translateR(cpsdrhs || 'na', name),
			solver: SOLVER_STATES[objectiveClass][solver],
		}
		let optimizationData = {
			...sparkData,
			slides: JSON.stringify(spreadsheetToR(slides.datas)),
			names: JSON.stringify(slides.datas.map(data => data.name))
		}
		console.log(sparkData)
		console.log(JSON.stringify(spreadsheetToR(slides.datas)))
		// doOptimization(optimizationData)
		// 	.then(res => {
		// 		if (typeof res[0] === "string" || res[0] instanceof String) {
		// 			setError(res)
		// 			setLoading(false)
		// 		} else {
		// 			res.type = "optimize"
		// 			res.optimization = sparkData
		// 			const d = slides.insertData(dataNames, current, res, name)
		// 			onSetDataNames([
		// 	      ...dataNames.slice(0, current+1),
		// 	      d.name,
		// 	      ...dataNames.slice(current+1)
		// 	    ])
		// 			onSetCurrent(current+1)
		// 			slides.data = d
		// 			onSetRightSidebar('none')
		// 			setLoading(false)
		// 		}
		// 	})
	}

	const handleClose = () => {
		onSetRightSidebar('none')
		setLoading(false)
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
			error={errorGeneral}
			setError={setErrorGeneral}
		/>,
		1: <Linear
			linear={linear}
			setLinear={setLinear}
			error={errorLinear}
			setError={setErrorLinear}
		/>,
		2: <Quadratic
			quadratic={quadratic}
			setQuadratic={setQuadratic}
			linear={linear}
			setLinear={setLinear}
			error={errorQuadratic}
			setError={setErrorQuadratic}
		/>
	}

	const filteredOptions = SOLVER_STATES[objectiveClass].filter(option => {
		const list = CONSTRAINTS_TYPE.filter(c => !constraints.includes(c))
			.map(c => CONSTRAINTS_TYPE.indexOf(c))

		for (let i=0; i<list.length; i++) {
			if (SOLVER_CONSTRAINTS[list[i]].includes(option)) {
				console.log(option)
				return option
			}
		}
	})

	const isEmptyObjective = {
		0: objective === '' || decision === '',
		1: linear === '',
		2: quadratic === '',
	}

	const isError = errorGeneral !== null
		|| errorQuadratic !== null
		|| errorLinear !== null
		|| errorBounds !== null
		|| errorGconstraint !== null
		|| errorQconstraint !== null
		|| errorLconstraint !== null
		|| error0cone !== null
		|| errorLcone !== null
		|| errorSocone !== null
		|| errorEcone !== null
		|| error3cone !== null
		|| error2cone !== null
		|| errorPsdcone !== null

	return (
		<>
			<button className='rightsidebar-close' onClick={handleClose}>
				<Icon path={mdiClose} size={1}/>
			</button>
			<div className='rightsidebar-heading'>Optimize</div>
			<div className='rightsidebar-label'>Objective</div>
			{OBJECTIVE_STATES[objectiveClass]}
			<Variable
				label="Objective function type"
				onChange={handleUpdateObjectiveClass}
				options={OBJECTIVE_CLASS}
				name={OBJECTIVE_CLASS[objectiveClass]}
			/>
			<div className='rightsidebar-buttonwrapper' onClick={handleMinimize}>
				<button className='rightsidebar-button'
					style={{
						backgroundColor: minMax === 0 && color[authUser.uid],
						boxShadow: minMax === 0 ? 'inset 0px 0px 0px 3px #fff' : 'none',
	          border: minMax === 0 ? '1px solid '+ color[authUser.uid] : '1px solid #fff'
					}}
				></button>
				<div className='rightsidebar-buttontext'>Minimum</div>
			</div>
			<div className='rightsidebar-buttonwrapper' onClick={handleMaximize}>
				<button className='rightsidebar-button'
					style={{
						backgroundColor: minMax === 1 && color[authUser.uid],
						boxShadow: minMax === 1 ? 'inset 0px 0px 0px 3px #fff' : 'none',
	          border: minMax === 1 ? '1px solid '+ color[authUser.uid] : '1px solid #fff'
					}}
				></button>
				<div className='rightsidebar-buttontext'>Maximum</div>
			</div>
			<div className='rightsidebar-label'>Constraints</div>
			{!constraints.includes(CONSTRAINTS_TYPE[0]) &&
				<Fconstraint
					lhs={flhs}
					setLhs={setFlhs}
					dir={fdir}
					setDir={setFdir}
					rhs={frhs}
					setRhs={setFrhs}
					jacobian={jacobian}
					setJacobian={setJacobian}
					onClose={handleRemoveConstraint}
					error={errorGconstraint}
					setError={setErrorGconstraint}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[1]) &&
				<Bounds
					objectiveClass={objectiveClass}
					lhs={blhs} setLhs={setBlhs}
					dir={bdir} setDir={setBdir}
					rhs={brhs} setRhs={setBrhs}
					li={li} setLi={setLi}
					lb={lb} setLb={setLb}
					ui={ui} setUi={setUi}
					ub={ub} setUb={setUb}
					ld={ld} setUb={setLd}
					ud={ud} setUb={setUd}
					onClose={handleRemoveConstraint}
					error={errorBounds}
					setError={setErrorBounds}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[2]) &&
				<Lconstraint
					lhs={llin}
					setLhs={setLlin}
					dir={ldir}
					setDir={setLdir}
					rhs={lrhs}
					setRhs={setLrhs}
					onClose={handleRemoveConstraint}
					error={errorLconstraint}
					setError={setErrorLconstraint}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[3]) &&
				<Qconstraint
					quadratic={qquad}
					setQuadratic={setQquad}
					linear={qlin}
					setLinear={setQlin}
					dir={qdir}
					setDir={setQdir}
					rhs={qrhs}
					setRhs={setQrhs}
					onClose={handleRemoveConstraint}
					error={errorQconstraint}
					setError={setErrorQconstraint}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[4]) &&
				<Cconstraint
					lhs={c0lhs}
					setLhs={setC0lhs}
					cone={c0cone}
					setCone={setC0cone}
					rhs={c0rhs}
					setRhs={setC0rhs}
					type={CONSTRAINTS_TYPE[4]}
					onClose={() => handleRemoveConstraint(4)}
					error={error0cone}
					setError={setError0cone}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[5]) &&
				<Cconstraint
					lhs={cllhs}
					setLhs={setCllhs}
					cone={lcone}
					setCone={setlcone}
					rhs={clrhs}
					setRhs={setClrhs}
					type={CONSTRAINTS_TYPE[5]}
					onClose={() => handleRemoveConstraint(5)}
					error={errorLcone}
					setError={setErrorLcone}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[6]) &&
				<Cconstraint
					lhs={csolhs}
					setLhs={setCsolhs}
					cone={socone}
					setCone={setSocone}
					rhs={csorhs}
					setRhs={setCsorhs}
					type={CONSTRAINTS_TYPE[6]}
					onClose={() => handleRemoveConstraint(6)}
					error={errorSocone}
					setError={setErrorSocone}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[7]) &&
				<Cconstraint
					lhs={cexlhs}
					setLhs={setCexlhs}
					cone={excone}
					setCone={setExcone}
					rhs={cexrhs}
					setRhs={setCexrhs}
					type={CONSTRAINTS_TYPE[7]}
					onClose={() => handleRemoveConstraint(7)}
					error={errorEcone}
					setError={setErrorEcone}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[8]) &&
				<Cconstraint
					lhs={cpplhs}
					setLhs={setCpplhs}
					cone={ppcone}
					setCone={setPpcone}
					rhs={cpprhs}
					setRhs={setCpprhs}
					type={CONSTRAINTS_TYPE[8]}
					onClose={() => handleRemoveConstraint(8)}
					error={error3cone}
					setError={setError3cone}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[9]) &&
				<Cconstraint
					lhs={cpdlhs}
					setLhs={setCpdlhs}
					cone={pdcone}
					setCone={setPdcone}
					rhs={cpdrhs}
					setRhs={setCpdrhs}
					type={CONSTRAINTS_TYPE[9]}
					onClose={() => handleRemoveConstraint(9)}
					error={error2cone}
					setError={setError2cone}
				/>
			}
			{!constraints.includes(CONSTRAINTS_TYPE[10]) &&
				<Cconstraint
					lhs={cpsdlhs}
					setLhs={setCpsdlhs}
					cone={psdcone}
					setCone={setPsdcone}
					rhs={cpsdrhs}
					setRhs={setCpsdrhs}
					type={CONSTRAINTS_TYPE[10]}
					onClose={() => handleRemoveConstraint(10)}
					error={errorPsdcone}
					setError={setErrorPsdcone}
				/>
			}
			{constraints.length > 0 &&
				<OptionsWithLists onChange={handleAddConstraint} options={constraints} name='Add constraint' />}
			<Variable
				label="Solver"
				onChange={handleUpdateSolver}
				options={filteredOptions}
				name={filteredOptions[0]}
			/>
			<div className='rightsidebar-text'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
			<div className='rightsidebar-subtext'>
				Each cell reference reprsents a single value in a matrix. A 1x3 matrix with values (1,2,3) in cells (A1,A2,A3) has cell reference: A1:A3.
			</div>
			{loading
				?	<div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin/></div>
				: <input
						disabled={isEmptyObjective[objectiveClass] || isError}
						type="submit"
						style={{ color : isEmptyObjective[objectiveClass] || isError ? "rgb(0, 0, 0, 0.5)" : color[authUser.uid]}}
						onClick={handleSubmit}
						className='rightsidebar-submit'
					/>
			}
		</>
	)
}

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)
const OptionsWithListsDropdown = withListsDropdown(Options)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	slides: (state.slidesState.slides || {}),
	color: (state.colorState.colors || {}),
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
)(Optimize)
