//
//  General Objective
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange, validateCell } from './validate';

const General = ({
  objective, decision, gradient, hessian, error,
  setObjective, setDecision, setGradient, setHessian, setError,
}) => (
  <>
    <div className="rightsidebar-label">General nonlinear objective</div>
    <CellReference
      text="Objective:"
      cell={objective}
      onSetCell={setObjective}
      placeholder="A1"
      onValidate={validateCell}
      onSetError={setError}
    />
    <CellReference
      text="Decision:"
      cell={decision}
      onSetCell={setDecision}
      placeholder="B1:B2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <CellReference
      text="Gradient (optional):"
      cell={gradient}
      onSetCell={setGradient}
      placeholder="C1"
      onValidate={validateCell}
      onSetError={setError}
    />
    <CellReference
      text="Hessian (optional):"
      cell={hessian}
      onSetCell={setHessian}
      placeholder="D1"
      onValidate={validateCell}
      onSetError={setError}
    />
    <div className="rightsidebar-text">
      {error && <div className="rightsidebar-error">{error}</div>}
    </div>
  </>
);

export default General;
