//
//  General Objective
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange, validateCell } from './validate';

const General = ({
  dataNames, objective, decision, gradient, hessian, error,
  setObjective, setDecision, setGradient, setHessian, setError,
}) => (
  <>
    <div className="rightsidebar-label">General nonlinear objective</div>
    <CellReference
      text="Objective:"
      cell={objective}
      onSetCell={setObjective}
      placeholder="A1"
      onValidate={(v) => validateCell(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Decision:"
      cell={decision}
      onSetCell={setDecision}
      placeholder="B1:B2"
      onValidate={(v) => validateCellorSingleRange(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Gradient (optional):"
      cell={gradient}
      onSetCell={setGradient}
      placeholder="C1"
      onValidate={(v) => validateCell(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Hessian (optional):"
      cell={hessian}
      onSetCell={setHessian}
      placeholder="D1"
      onValidate={(v) => validateCell(dataNames, v)}
      onSetError={setError}
    />
    <div className="rightsidebar-text">
      {error && <div className="rightsidebar-error">{error}</div>}
    </div>
  </>
);

const mapStateToProps = (state) => ({
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(General);
