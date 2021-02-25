//
//  Linear Objective
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange } from './index';

const Linear = ({
  linear, error, setLinear, setError,
}) => {
  return (
    <>
      <div className="rightsidebar-label">Linear objective</div>
      <div className="rightsidebar-input-text-1part1">Linear</div>
      <CellReference
        cell={linear}
        onSetCell={setLinear}
        classname="rightsidebar-input-1part1"
        placeholder="A1:A2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

export default Linear;
