//
//  General Objective
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange, validateCell } from './index';

const General = ({
  objective, decision, gradient, hessian, error,
  setObjective, setDecision, setGradient, setHessian, setError,
}) => {
  return (
    <>
      <div className="rightsidebar-label">General nonlinear objective</div>
      <div className="rightsidebar-input-text-2part1">Objective</div>
      <div className="rightsidebar-input-text-2part2">Decision</div>
      <CellReference
        cell={objective}
        onSetCell={setObjective}
        classname="rightsidebar-input-2part1"
        placeholder="A1"
        onValidate={validateCell}
        onSetError={setError}
      />
      <CellReference
        cell={decision}
        onSetCell={setDecision}
        classname="rightsidebar-input-2part2"
        placeholder="B1:B2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <div className="rightsidebar-input-text-2part1">Gradient (optional)</div>
      <div className="rightsidebar-input-text-2part2">Hessian (optional)</div>
      <CellReference
        cell={gradient}
        onSetCell={setGradient}
        classname="rightsidebar-input-2part1"
        placeholder="C1"
        onValidate={validateCell}
        onSetError={setError}
      />
      <CellReference
        cell={hessian}
        onSetCell={setHessian}
        classname="rightsidebar-input-2part2"
        placeholder="D1"
        onValidate={validateCell}
        onSetError={setError}
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

export default General;
