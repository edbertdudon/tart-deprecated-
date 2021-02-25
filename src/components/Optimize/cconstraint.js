//
//  Conic Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange, validateCellorNumeric } from './index';

const Cconstraint = ({
  isActive, lhs, cone, rhs, type, error,
  onClose, setLhs, setCone, setRhs, setError,
}) => {
  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">{type}</div>
      <button className="rightsidebar-label-close" onClick={onClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <div className="rightsidebar-input-text-3part1">Linear</div>
      <div className="rightsidebar-input-text-3part2">cone</div>
      <div className="rightsidebar-input-text-3part3">Numeric</div>
      <CellReference
        cell={lhs}
        onSetCell={setLhs}
        classname="rightsidebar-input-3part1"
        placeholder="A1:A2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <CellReference
        cell={cone}
        onSetCell={setCone}
        classname="rightsidebar-input-3part2"
        placeholder="B1"
        onValidate={validateCellorNumeric}
        onSetError={setError}
      />
      <CellReference
        cell={rhs}
        onSetCell={setRhs}
        classname="rightsidebar-input-3part3"
        placeholder="C1:C2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

export default Cconstraint;
