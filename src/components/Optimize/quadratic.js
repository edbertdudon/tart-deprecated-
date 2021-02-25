//
//  Quadratic
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import CellReference from '../RightSidebar/cellreference';
import { validateRangeNotOne, validateCellorSingleRange } from './index';

const Quadratic = ({
  quadratic, linear, error, setQuadratic, setLinear, setError,
}) => {
  return (
    <>
      <div className="rightsidebar-label">Quadratic objective</div>
      <div className="rightsidebar-input-text-2part1">Quadratic</div>
      <div className="rightsidebar-input-text-2part2">Linear</div>
      <CellReference
        cell={quadratic}
        onSetCell={setQuadratic}
        classname="rightsidebar-input-2part1"
        placeholder="A1:A2"
        onValidate={validateRangeNotOne}
        onSetError={setError}
      />
      <CellReference
        cell={linear}
        onSetCell={setLinear}
        classname="rightsidebar-input-2part2"
        placeholder="B1:B2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

export default Quadratic;
