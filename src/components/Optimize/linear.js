//
//  Linear Objective
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { updateCellorSingleRange } from './index';

const Linear = ({
  linear, error, setLinear, setError,
}) => {
  const handleUpdateLinear = (e) => updateCellorSingleRange(e, setLinear, setError);

  return (
    <>
      <div className="rightsidebar-label">Linear objective</div>
      <div className="rightsidebar-input-text-1part1">Linear matrix</div>
      <input
        type="text"
        className="rightsidebar-input-1part1"
        onChange={handleUpdateLinear}
        value={linear}
        placeholder="A1:A2"
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

export default Linear;
