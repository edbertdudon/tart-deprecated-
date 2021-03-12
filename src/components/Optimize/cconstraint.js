//
//  Conic Constraints
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange, validateCellorNumeric } from './validate';

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
      <button type="button" className="rightsidebar-label-close" onClick={onClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <CellReference
        text="Linear:"
        cell={lhs}
        onSetCell={setLhs}
        placeholder="A1:A2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <CellReference
        text="Cone:"
        cell={cone}
        onSetCell={setCone}
        placeholder="B1"
        onValidate={validateCellorNumeric}
        onSetError={setError}
      />
      <CellReference
        text="Numeric:"
        cell={rhs}
        onSetCell={setRhs}
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
