//
//  Optimize
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState, useEffect, useRef } from 'react';
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
import Variable from '../RightSidebar/variable';
import Button from '../RightSidebar/button';
import { spreadsheetToR, doOptimization, translateR } from '../Spreadsheet/cloudr';
import { createFile, asCell } from '../../functions';
import { checkErrors, checkConeErrors } from './validate';
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

// const CONES_TYPE = ['K_zero', 'K_lin', 'K_soc', 'K_expp', 'K_powp', 'K_powd', 'K_psd'];

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
  ['optimx', 'nloptr.lbfgs', 'lpsolve', 'glpk', 'ecos', 'quadprog', 'qpoases'],
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

const Optimize = ({
  firebase, authUser, worksheetname, slides, current, color,
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
    const { sri, sci } = selector.range;
    setObjective(asCell(sri, sci));
  }, []);

  const handleMinimize = () => setMinMax(0);

  const handleMaximize = () => setMinMax(1);

  const handleChangeObjective = (i) => {
    switch (i) {
      case 0: {
        if (objectiveClass === 1 && linear.length > 0) {
          setObjective(linear);
        }
        if (objectiveClass === 2 && quadratic.length > 0) {
          setObjective(quadratic);
          if (linear.length > 0) {
            setDecision(linear);
          }
        }
        break;
      }
      case 1: {
        if (objectiveClass === 0 && objective.length > 0) {
          setLinear(objective);
        }
        if (objectiveClass === 2 && quadratic.length > 0) {
          setLinear(quadratic);
        }
        break;
      }
      case 2: {
        if (objectiveClass === 0 && objective.length > 0) {
          setQuadratic(objective);
          if (decision.length > 0) {
            setLinear(decision);
          } else {
            setLinear('');
          }
        }
        if (objectiveClass === 1 && linear.length > 0) {
          setQuadratic(linear);
          setLinear('');
        }
        break;
      }
      default:
    }
  };

  const handleAddConstraint = (i) => setConstraints(
    constraints.filter((constraint) => constraint !== constraints[i]),
  );

  const handleRemoveConstraint = (index) => setConstraints(
    constraints.map((c) => CONSTRAINTS_TYPE.indexOf(c))
      .concat(index)
      .sort((a, b) => a - b)
      .map((c) => CONSTRAINTS_TYPE[c]),
  );

  const fConstraint = CONSTRAINTS_TYPE.filter((c) => !constraints.includes(c))
    .map((c) => SOLVER_CONSTRAINTS[CONSTRAINTS_TYPE.indexOf(c)]) || [];

  let sConstraint = fConstraint[0] || [];
  for (let i = 1; i < fConstraint.length; i += 1) {
    sConstraint = sConstraint.filter((f) => fConstraint[i].includes(f));
  }

  const filteredOptions = constraints === CONSTRAINTS_TYPE
    ? SOLVER_STATES[objectiveClass]
    : SOLVER_STATES[objectiveClass].filter((i) => sConstraint.includes(i));

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

  const handleSubmit = () => {
    setLoading(true);
    const { name } = slides.data;
    const data = {
      solver: filteredOptions[solver],
      slides: JSON.stringify(spreadsheetToR(slides.datas)),
      names: JSON.stringify(slides.datas.map((d) => d.name)),
    };

    if (minMax === 1) {
      data.minmax = minMax;
    }

    // optimx
    if (objectiveClass === 0 && solver === 0) {
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

    if (objectiveClass === 1 || (objectiveClass === 2 && linear.length > 0)) {
      data.linear = translateR(linear, name);
    }

    if (objectiveClass === 2) {
      data.quadratic = translateR(quadratic, name);
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

    doOptimization(data).then((res) => {
      if ('error' in res) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // const { res } = r;
      res.type = 'optimize';
      delete data.slides;
      delete data.names;
      // res.optimization = { ...sparkdata, solver: data.solver, sample: true };
      res.optimization = { ...data, sample: true };
      let prefix;
      if (objectiveClass === 0) {
        prefix = objective;
      } else if (objectiveClass === 1) {
        prefix = linear;
      } else {
        prefix = quadratic;
      }

      const sheetname = `optimization ${prefix}`;
      const isEmpty = slides.insertData(current, res, sheetname, 'read');

      onSetDataNames(slides.datas.map((it) => it.name));
      if (!isEmpty) {
        onSetCurrent(current + 1);
      }
      onSetRightSidebar('none');
      setLoading(false);

      onSetSaving(true);
      firebase.doUploadWorksheet(
        authUser.uid,
        worksheetname,
        createFile(slides, worksheetname),
      ).then(() => onSetSaving(false));
    });
  };

  // const handleClose = () => {
  //   onSetRightSidebar('none');
  //   setLoading(false);
  // };

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

  const isEmptyObjective = {
    0: objective === '' || decision === '' || errorGeneral !== null,
    1: linear === '' || errorLinear !== null,
    2: quadratic === '' || errorQuadratic !== null,
  };

  const isError = isEmptyObjective[objectiveClass]
    || checkErrors(hasGConstraint, errorGconstraint, flhs, fdir, frhs)
    || checkErrors(hasBounds, errorBounds, blhs, bdir, brhs)
    || checkErrors(hasLConstraint, errorLconstraint, llin, ldir, lrhs)
    || checkErrors(hasQConstraint, errorQconstraint, qquad, qdir, qrhs)
    || checkConeErrors(hasC0cone, error0cone, c0lhs, c0rhs)
    || checkConeErrors(hasLcone, errorLcone, cllhs, clrhs)
    || checkConeErrors(hasSocone, errorSocone, csolhs, csorhs)
    || checkConeErrors(hasEcone, errorEcone, cexlhs, cexrhs)
    || checkConeErrors(has3cone, error3cone, cpplhs, cpprhs)
    || checkConeErrors(has2cone, error2cone, cpdlhs, cpdrhs)
    || checkConeErrors(hasPsdcone, errorPsdcone, cpsdlhs, cpsdrhs);

  return (
    <>
      <div className="rightsidebar-label-header">Objective</div>
      {OBJECTIVE_STATES[objectiveClass]}
      <Variable
        label="type"
        setSelected={setObjectiveClass}
        options={OBJECTIVE_CLASS}
        name={OBJECTIVE_CLASS[objectiveClass]}
        onSelect={handleChangeObjective}
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
        setLd={setLd}
        ud={ud}
        setUd={setUd}
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
        )}
      <Variable
        label="Solver"
        setSelected={setSolver}
        options={filteredOptions}
        name={filteredOptions[solver]}
      />
      {(objectiveClass === 0 && solver === 0) && (
        <Variable
          label="Method"
          setSelected={setMethod}
          options={OPTIMX_METHODS}
          name={OPTIMX_METHODS[method]}
        />
      )}
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
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
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
