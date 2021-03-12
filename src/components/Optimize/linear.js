//
//  Linear Objective
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange } from './validate';

const Linear = ({
  linear, error, setLinear, setError,
}) => (
  <>
    <div className="rightsidebar-label">Linear objective</div>
    <CellReference
      text="Linear:"
      cell={linear}
      onSetCell={setLinear}
      placeholder="A1:A2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <div className="rightsidebar-text">
      {error && <div className="rightsidebar-error">{error}</div>}
    </div>
  </>
);

export default Linear;
