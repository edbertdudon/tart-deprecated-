//
//  Quadratic
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import CellReference from '../RightSidebar/cellreference';
import { validateRangeNotOne, validateCellorSingleRange } from './validate';

const Quadratic = ({
  quadratic, linear, error, setQuadratic, setLinear, setError,
}) => (
  <>
    <div className="rightsidebar-label">Quadratic objective</div>
    <CellReference
      text="Quadratic:"
      cell={quadratic}
      onSetCell={setQuadratic}
      placeholder="A1:A2"
      onValidate={validateRangeNotOne}
      onSetError={setError}
    />
    <CellReference
      text="Linear (optional):"
      cell={linear}
      onSetCell={setLinear}
      placeholder="B1:B2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <div className="rightsidebar-text">
      {error && <div className="rightsidebar-error">{error}</div>}
    </div>
  </>
);

export default Quadratic;
