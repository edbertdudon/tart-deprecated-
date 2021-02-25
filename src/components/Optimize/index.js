//
//  Optimize
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiLoading, mdiClose } from '@mdi/js';
import General from './general';
import Linear from './linear';
import Quadratic from './quadratic';
import Bounds from './bounds';
import Fconstraint from './fconstraint';
import Cconstraint from './cconstraint';
import Qconstraint from './qconstraint';
import Lconstraint from './lconstraint';
import Variable from '../Statistics/core/variable';
import Button from '../RightSidebar/button';
import {
  letterToColumn, columnToLetter, spreadsheetToR, doOptimization, translateR,
} from '../Spreadsheet/cloudr';
import {
  LETTERS_REFERENCE, NUMBERS_REFERENCE, FORMULA_CELL_REFERENCES, createFile,
  VALID_RANGE_REFERENCES, VALID_FORMULA_CELL_REFERENCES, RANGE_REFERENCES,
} from '../../functions';
import withLists from '../RightSidebar/withLists';
import { withFirebase } from '../Firebase';

const OBJECTIVE_CLASS = ['General nonlinear optimization', 'Linear programming', 'Quadratic programming'];

const CONSTRAINTS_TYPE = [
  'General form constraints (default)',
  'Bounds',
  'Linear constraints',
  'Quadratic constraints',
  'Zero cone',
  'Linear cone',
  'Second-order cone',
  'Exponential cone',
  '3-dimensional primal power cone',
  '2-dimensional primal power cone',
  'Positive semidefinite cone',
];

const CONES_TYPE = ['K_zero', 'K_lin', 'K_soc', 'K_expp', 'K_powp', 'K_powd', 'K_psd'];

const SOLVER_STATES = [
  // General
  ['optimx', 'nloptr.lbfgs'],
  // Linear
  ['lpsolve', 'glpk', 'ecos'],
  // Quadratic
  ['quadprog', 'qpoases'],
];

const SOLVER_CONSTRAINTS = [
  // General
  ['nloptr.lbfgs'],
  // Bound
  ['optimx'],
  // Linear
  ['lpsolve', 'glpk', 'quadprog', 'qpoases', 'ecos'],
  // Qudaratic
  [],
  // Zero cone
  ['ecos'],
  // Linear cone
  ['ecos'],
  // Second-order cone
  ['ecos'],
  // Exponential cone
  ['ecos'],
  // 3-dimensional primal power cone
  ['ecos'],
  // 2-dimensional primal power cone
  ['ecos'],
  // Positive semidefinite cone
  ['ecos'],
];

const OPTIMX_METHODS = [
  'Nelder-mead', 'L-BFGS-B', 'BFGS', 'CG', 'nlm', 'nlminb', 'spg',
  'ucminf', 'newuoa', 'bobyqa', 'nmkb', 'hjkb', 'Rcgmin', 'Rvmmin',
];

export function validateCell(v) {
  if (!VALID_FORMULA_CELL_REFERENCES.test(v)) {
    return ('Invalid cell reference.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref));
    if (ml[1] < ml[0] || ml.length !== 1) {
      return ('Invalid range.');
    }
    const mn = v.match(NUMBERS_REFERENCE);
    if (mn !== null) {
      mn.map((ref) => parseInt(ref));
      if (mn[1] < mn[0] || mn.length !== 1) {
        return ('Invalid range.');
      }
    }
  }
  return (null);
}

export function validateCellorNumeric(v) {
  if (!NUMBERS_REFERENCE.test(v)) {
    validateCell(v);
  }
  return null;
}

export function validateCellorSingleRange(v) {
  if (!(VALID_FORMULA_CELL_REFERENCES.test(v) || VALID_RANGE_REFERENCES.test(v))) {
    return ('Invalid cell, row or column.');
  }
  const mc = v.match(FORMULA_CELL_REFERENCES);
  if (mc === null) {
    return ('Invalid cell.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE);
    const mn = v.match(NUMBERS_REFERENCE);
    if (!(ml[1] == ml[0] || mn[1] == mn[0]) || ml.length > 2 || mn.length > 2) {
      return ('Invalid row or column. Must be limited to a single row or column');
    }
  }
  return (null);
}

// function validateRange(v) {
//   if (!VALID_RANGE_REFERENCES.test(v)) {
//     return ('Invalid range reference.');
//   }
//   const mc = v.match(FORMULA_CELL_REFERENCES);
//   if (mc === null) {
//     return ('Invalid cell.');
//   }
//   const mr = v.match(RANGE_REFERENCES);
//   if (mr !== null) {
//     const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
//     if (ml[1] < ml[0] || ml.length !== 2) {
//       return ('Invalid range.');
//     }
//     const mn = v.match(NUMBERS_REFERENCE);
//     if (mn !== null) {
//       mn.map((ref) => parseInt(ref));
//       if (mn[1] < mn[0] || mn.length !== 2) {
//         return ('Invalid range.');
//       }
//     }
//   }
//   return (null);
// }

export function validateRangeNotOne(v) {
  if (!VALID_RANGE_REFERENCES.test(v)) {
    return ('Invalid range reference.');
  }
  const mc = v.match(FORMULA_CELL_REFERENCES);
  if (mc === null) {
    return ('Invalid cell.');
  }
  const mr = v.match(RANGE_REFERENCES);
  if (mr !== null) {
    const ml = v.match(LETTERS_REFERENCE).map((ref) => letterToColumn(ref) - 1);
    if (ml[1] <= ml[0] || ml.length !== 2) {
      return ('Invalid range. Must be greater than a single row or column');
    }
    const mn = v.match(NUMBERS_REFERENCE);
    if (mn !== null) {
      mn.map((ref) => parseInt(ref));
      if (mn[1] <= mn[0] || mn.length !== 2) {
	      return ('Invalid range. Must be greater than a single row or column');
	    }
    }
  }
  return (null);
}

function complete(lhs, dir, rhs) {
  if ((lhs.length === 0 && dir.length === 0 && rhs.length === 0)
    || (lhs.length > 0 && dir.length > 0 && rhs.length > 0)) {
    return true;
  }
  return false;
}

function completeCone(lhs, rhs) {
  if ((lhs.length === 0 && rhs.length === 0)
    || (lhs.length > 0 && rhs.length > 0)) {
    return true;
  }
  return false;
}

// what if its column?
// function isValidRowLength(lhs, rhs) {
//   const mnl = lhs.match(NUMBERS_REFERENCE)
//   const mnr = rhs.match(NUMBERS_REFERENCE)
//
//   if (mnl !== null
//     && mnr !== null
//     && (mnl[1] - mnl[0] === mnr[1] - mnr[0])
//   ) {
//     return true;
//   }
//   return false;
// }
//
// function isValidColLength(lhs, rhs) {
//   let mll = v.match(LETTERS_REFERENCE)
//   let mlr = v.match(LETTERS_REFERENCE)
//
//   if (mll === null || mlr === null) {
//     return false;
//   }
//
//   mll = mll.map((ref) => letterToColumn(ref));
//   mlr = mlr.map((ref) => letterToColumn(ref));
//
//   if (mll[1] - mll[0] ==== mlr[1] - mlr[0]) {
//     return true;
//   }
//
//   return false;
// }
//
// // what if its a combination of columns and row for lhs, dir, rhs
// function isValid(lhs, dir, rhs) {
//   if (isValidRowLength(lhs, dir) && isValidRowLength(dir, rhs)) {
//     return true;
//   }
//   return false;
// }

const Optimize = ({
  firebase, authUser, worksheetname, slides, dataNames, current, saving, color,
  onSetDataNames, onSetCurrent, onSetSaving, onSetRightSidebar,
}) => {
  const [objective, setObjective] = useState('');
  const [quadratic, setQuadratic] = useState('');
  const [linear, setLinear] = useState('');
  const [gradient, setGradient] = useState('');
  const [hessian, setHessian] = useState('');
  const [minMax, setMinMax] = useState(0);
  const [objectiveClass, setObjectiveClass] = useState(0);
  const [decision, setDecision] = useState('');
  const [constraints, setConstraints] = useState(CONSTRAINTS_TYPE);
  // General constraints
  const [flhs, setFlhs] = useState('');
  const [fdir, setFdir] = useState('');
  const [frhs, setFrhs] = useState('');
  const [jacobian, setJacobian] = useState('');
  // Bounds
  const [blhs, setBlhs] = useState('');
  const [bdir, setBdir] = useState('');
  const [brhs, setBrhs] = useState('');
  const [li, setLi] = useState('');
  const [lb, setLb] = useState('');
  const [ui, setUi] = useState('');
  const [ub, setUb] = useState('');
  const [ld, setLd] = useState('');
  const [ud, setUd] = useState('');
  // Quadratic constraints
  const [qquad, setQquad] = useState('');
  const [qlin, setQlin] = useState('');
  const [qdir, setQdir] = useState('');
  const [qrhs, setQrhs] = useState('');
  // Linear constraints
  const [llin, setLlin] = useState('');
  const [ldir, setLdir] = useState('');
  const [lrhs, setLrhs] = useState('');
  // Zero cone
  const [c0lhs, setC0lhs] = useState('');
  const [c0cone, setC0cone] = useState(1);
  const [c0rhs, setC0rhs] = useState('');
  // Linear cone
  const [cllhs, setCllhs] = useState('');
  const [lcone, setlcone] = useState(1);
  const [clrhs, setClrhs] = useState('');
  // Second-order cone
  const [csolhs, setCsolhs] = useState('');
  const [socone, setSocone] = useState(1);
  const [csorhs, setCsorhs] = useState('');
  // Exponential cone
  const [cexlhs, setCexlhs] = useState('');
  const [excone, setExcone] = useState(1);
  const [cexrhs, setCexrhs] = useState('');
  // Power 3d cone
  const [cpplhs, setCpplhs] = useState('');
  const [ppcone, setPpcone] = useState(0.5);
  const [cpprhs, setCpprhs] = useState('');
  // Power 2d cone
  const [cpdlhs, setCpdlhs] = useState('');
  const [pdcone, setPdcone] = useState(0.5);
  const [cpdrhs, setCpdrhs] = useState('');
  // Positive semidefinite cone
  const [cpsdlhs, setCpsdlhs] = useState('');
  const [psdcone, setPsdcone] = useState(1);
  const [cpsdrhs, setCpsdrhs] = useState('');

  const [solver, setSolver] = useState(0);
  const [method, setMethod] = useState(0);
  const [loading, setLoading] = useState(false);
  // Errors
  const [error, setError] = useState(null);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [errorQuadratic, setErrorQuadratic] = useState(null);
  const [errorLinear, setErrorLinear] = useState(null);
  const [errorBounds, setErrorBounds] = useState(null);
  const [errorGconstraint, setErrorGconstraint] = useState(null);
  const [errorQconstraint, setErrorQconstraint] = useState(null);
  const [errorLconstraint, setErrorLconstraint] = useState(null);
  const [error0cone, setError0cone] = useState(null);
  const [errorLcone, setErrorLcone] = useState(null);
  const [errorSocone, setErrorSocone] = useState(null);
  const [errorEcone, setErrorEcone] = useState(null);
  const [error3cone, setError3cone] = useState(null);
  const [error2cone, setError2cone] = useState(null);
  const [errorPsdcone, setErrorPsdcone] = useState(null);

  useEffect(() => {
    const { selector } = slides.sheet;
    const {
      sri, sci, eri, eci,
    } = selector.range;
    setObjective(columnToLetter(sci + 1) + (sri + 1));
  }, []);

  const handleMinimize = () => setMinMax(0);

  const handleMaximize = () => setMinMax(1);

  const handleAddConstraint = (i) => setConstraints(
    constraints.filter((constraint) => constraint !== constraints[i])
  );

  const handleRemoveConstraint = (index) => setConstraints(
    constraints.map((c) => CONSTRAINTS_TYPE.indexOf(c))
      .concat(index)
      .sort((a, b) => a - b)
      .map((c) => CONSTRAINTS_TYPE[c]),
  );

  const handleSubmit = () => {
    setLoading(true);
    const { name } = slides.data;
    const data = {
      solver: SOLVER_STATES[objectiveClass][solver],
      slides: JSON.stringify(spreadsheetToR(slides.datas)),
      names: JSON.stringify(slides.datas.map((d) => d.name)),
    };

    if (minMax == 1) {
      data.minmax = minMax;
    }

    // optimx
    if (objectiveClass == 0 && solver == 0) {
      data.method = OPTIMX_METHODS[method];
    }

    if (objectiveClass === 0) {
      data.objective = translateR(objective, name);
      data.decision = translateR(decision, name);
      if (gradient.length > 0) {
        data.gradient = translateR(gradient, name);
      }
      if (hessian.length > 0) {
        data.hessian = translateR(hessian, name);
      }
    }

    if (objectiveClass === 2) {
      data.quadratic = translateR(quadratic, name);
    }

    if (linear.length > 0) {
      data.linear = translateR(linear, name);
    }

    if (hasGConstraint) {
      data.flhs = translateR(flhs, name);
      data.fdir = translateR(fdir, name);
      data.frhs = translateR(frhs, name);
      if (jacobian.length > 0) {
        data.jacobian = translateR(jacobian, name);
      }
    }

    if (hasBounds) {
      if (objectiveClass === 0) {
        data.blhs = translateR(blhs, name);
        data.bdir = translateR(bdir, name);
        data.brhs = translateR(brhs, name);
      } else {
        if (li.length > 0) {
          data.lowerindex = translateR(li, name);
        }
        if (lb.length > 0) {
          data.lowerbound = translateR(lb, name);
        }
        if (ui.length > 0) {
          data.upperindex = translateR(ui, name);
        }
        if (ub.length > 0) {
          data.upperbound = translateR(ub, name);
        }
        if (ld.length > 0) {
          data.lowerlimit = translateR(ld, name);
        }
        if (ud.length > 0) {
          data.upperlimit = translateR(ud, name);
        }
      }
    }

    if (hasLConstraint) {
      data.llin = translateR(llin, name);
      data.ldir = translateR(ldir, name);
      data.lrhs = translateR(lrhs, name);
    }

    if (hasQConstraint) {
      data.qquad = translateR(qquad, name);
      if (qlin.length > 0) {
        data.qlin = translateR(qlin, name);
      }
      data.qdir = translateR(qdir, name);
      data.qrhs = translateR(qrhs, name);
    }

    if (hasC0cone) {
      data.c0lhs = translateR(c0lhs, name);
      // if not default value
      if (c0cone.length !== 1) {
        data.c0cone = translateR(c0cone, name);
      }
      data.c0rhs = translateR(c0rhs, name);
    }

    if (hasLcone) {
      data.cllhs = translateR(cllhs, name);
      if (lcone.length !== 1) {
        data.lcone = translateR(lcone, name);
      }
      data.clrhs = translateR(clrhs, name);
    }

    if (hasSocone) {
      data.csolhs = translateR(csolhs, name);
      if (socone.length !== 1) {
        data.socone = translateR(socone, name);
      }
      data.csorhs = translateR(csorhs, name);
    }

    if (hasEcone) {
      data.cexlhs = translateR(cexlhs, name);
      if (excone.length !== 1) {
        data.excone = translateR(excone, name);
      }
      data.cexrhs = translateR(cexrhs, name);
    }

    if (has3cone) {
      data.cpplhs = translateR(cpplhs, name);
      if (ppcone.length !== 0.5) {
        data.ppcone = translateR(ppcone, name);
      }
      data.cpprhs = translateR(cpprhs, name);
    }

    if (has2cone) {
      data.cpdlhs = translateR(cpdlhs, name);
      if (pdcone.length !== 0.5) {
        data.pdcone = translateR(pdcone, name);
      }
      data.cpdrhs = translateR(cpdrhs, name);
    }

    if (hasPsdcone) {
      data.cpsdlhs = translateR(cpsdlhs, name);
      if (psdcone.length !== 1) {
        data.psdcone = translateR(psdcone, name);
      }
      data.cpsdrhs = translateR(cpsdrhs, name);
    }

    // doOptimization(data)
    // 	.then((res) => {
    // 		if (typeof res[0] === 'string' || res[0] instanceof String) {
    // 			setError(res);
    // 			setLoading(false);
    // 		} else {
    // 			res.type = 'optimize';
    // 			res.optimization = { ...data, sample: true };
    //
    //       const sheetname = `optimization ${
    //         objectiveClass === 0
    //           ? objective
    //           : objectiveClass === 1
    //             ? linear : quadratic}`;
    //       const isEmpty = slides.insertData(current, res, sheetname, 'read');
    //       onSetDataNames(slides.datas.map((it) => it.name));
    //       if (!isEmpty) {
    //         onSetCurrent(slides.sheetIndex);
    //       }
    // 			onSetRightSidebar('none');
    // 			setLoading(false);
    //
    //       onSetSaving(true);
    //     	firebase.doUploadWorksheet(
    //         authUser.uid,
    //         worksheetname,
    //         createFile(slides, worksheetname)
    //       ).then(() => onSetSaving(false));
    // 		}
    // 	});
  };

  const handleClose = () => {
    onSetRightSidebar('none');
    setLoading(false);
  };

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
    />,
  };

  const filteredOptions = SOLVER_STATES[objectiveClass].filter((option) => {
    if (constraints === CONSTRAINTS_TYPE) {
      return option
    }

    const list = CONSTRAINTS_TYPE
      .filter((c) => !constraints.includes(c))
      .map((c) => CONSTRAINTS_TYPE.indexOf(c));

    for (let i = 0; i < list.length; i++) {
      if (SOLVER_CONSTRAINTS[list[i]].includes(option)) {
        return option;
      }
    }
  });

  const isEmptyObjective = {
    0: objective === '' || decision === '' || errorGeneral !== null,
    1: linear === '' || errorLinear !== null,
    2: quadratic === '' || errorQuadratic !== null,
  };
  const hasGConstraint = !constraints.includes(CONSTRAINTS_TYPE[0]);
  const hasBounds = !constraints.includes(CONSTRAINTS_TYPE[1]);
  const hasLConstraint = !constraints.includes(CONSTRAINTS_TYPE[2]);
  const hasQConstraint = !constraints.includes(CONSTRAINTS_TYPE[3]);
  const hasC0cone = !constraints.includes(CONSTRAINTS_TYPE[4]);
  const hasLcone = !constraints.includes(CONSTRAINTS_TYPE[5]);
  const hasSocone = !constraints.includes(CONSTRAINTS_TYPE[6]);
  const hasEcone = !constraints.includes(CONSTRAINTS_TYPE[7]);
  const has3cone = !constraints.includes(CONSTRAINTS_TYPE[8]);
  const has2cone = !constraints.includes(CONSTRAINTS_TYPE[9]);
  const hasPsdcone = !constraints.includes(CONSTRAINTS_TYPE[10]);

  const isError = isEmptyObjective[objectiveClass]
    || (hasGConstraint && (errorGconstraint !== null || !complete(flhs, fdir, frhs)))
    || (hasBounds && ((errorBounds !== null || (objectiveClass === 0 && !complete(blhs, bdir, brhs)))))
		|| (hasLConstraint && (errorLconstraint !== null || !complete(llin, ldir, lrhs)))
		|| (hasQConstraint && (errorQconstraint !== null || !complete(qquad, qdir, qrhs)))
		|| (hasC0cone && (error0cone !== null || !completeCone(c0lhs, c0rhs)))
		|| (hasLcone && (errorLcone !== null || !completeCone(cllhs, clrhs)))
		|| (hasSocone && (errorSocone !== null || !completeCone(csolhs, csorhs)))
		|| (hasEcone && (errorEcone !== null || !completeCone(cexlhs, cexrhs)))
		|| (has3cone && (error3cone !== null || !completeCone(cpplhs, cpprhs)))
		|| (has2cone && (error2cone !== null || !completeCone(cpdlhs, cpdrhs)))
		|| (hasPsdcone && (errorPsdcone !== null || !completeCone(cpsdlhs, cpsdrhs)));

  return (
    <>
      <button className="rightsidebar-close" onClick={handleClose}>
        <Icon path={mdiClose} size={1} />
      </button>
      <div className="rightsidebar-heading">Optimize</div>
      <div className="rightsidebar-label-header">Objective</div>
      {OBJECTIVE_STATES[objectiveClass]}
      <Variable
        label="type"
        setSelected={setObjectiveClass}
        options={OBJECTIVE_CLASS}
        name={OBJECTIVE_CLASS[objectiveClass]}
      />
      <Button onClick={handleMinimize} condition={minMax === 0} text="Minimum" />
      <Button onClick={handleMaximize} condition={minMax === 1} text="Maximum" />
      <div className="rightsidebar-label-header">Constraints</div>
      <Fconstraint
        isActive={hasGConstraint}
        lhs={flhs}
        setLhs={setFlhs}
        dir={fdir}
        setDir={setFdir}
        rhs={frhs}
        setRhs={setFrhs}
        jacobian={jacobian}
        setJacobian={setJacobian}
        error={errorGconstraint}
        setError={setErrorGconstraint}
        onClose={handleRemoveConstraint}
      />
      <Bounds
        isActive={hasBounds}
        objectiveClass={objectiveClass}
        lhs={blhs}
        setLhs={setBlhs}
        dir={bdir}
        setDir={setBdir}
        rhs={brhs}
        setRhs={setBrhs}
        li={li}
        setLi={setLi}
        lb={lb}
        setLb={setLb}
        ui={ui}
        setUi={setUi}
        ub={ub}
        setUb={setUb}
        ld={ld}
        setUb={setLd}
        ud={ud}
        setUb={setUd}
        onClose={handleRemoveConstraint}
        error={errorBounds}
        setError={setErrorBounds}
      />
      <Lconstraint
        isActive={hasLConstraint}
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
      <Qconstraint
        isActive={hasQConstraint}
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
      <Cconstraint
        isActive={hasC0cone}
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
      <Cconstraint
        isActive={hasLcone}
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
      <Cconstraint
        isActive={hasSocone}
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
      <Cconstraint
        isActive={hasEcone}
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
      <Cconstraint
        isActive={has3cone}
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
      <Cconstraint
        isActive={has2cone}
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
      <Cconstraint
        isActive={hasPsdcone}
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
      {constraints.length > 0
        && (
        <OptionsWithLists
          onChange={handleAddConstraint}
          options={constraints}
          name="Add constraint"
        />
        )
      }
      <Variable
        label="Solver"
        setSelected={setSolver}
        options={filteredOptions}
        name={filteredOptions[solver]}
      />
      {(objectiveClass == 0 && solver == 0) &&
        <Variable
          label="Method"
          setSelected={setMethod}
          options={OPTIMX_METHODS}
          name={OPTIMX_METHODS[method]}
        />
      }
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
      <div className="rightsidebar-subtext">
        Each cell reference reprsents a single value in a matrix. A 1x3 matrix
        with values (1,2,3) in cells (A1,A2,A3) has cell reference: A1:A3.
      </div>
      {loading ? (
        <div className="rightsidebar-loading">
          <Icon path={mdiLoading} size={1.5} spin />
        </div>
      ) : (
        <input
          disabled={isError}
          type="submit"
          style={{ color: isError ? 'rgb(0, 0, 0, 0.5)' : color[authUser.uid] }}
          onClick={handleSubmit}
          className="rightsidebar-submit"
        />
      )}
    </>
  );
};

const Options = ({ option }) => option;
const OptionsWithLists = withLists(Options);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
  color: (state.colorState.colors || {}),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Optimize);
