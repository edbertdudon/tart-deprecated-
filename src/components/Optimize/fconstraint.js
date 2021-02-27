//
//  General Form Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange, validateCell } from './validate';

const Fconstraint = ({
  slides, isActive, lhs, dir, rhs, jacobian, error,
  setLhs, setDir, setRhs, setJacobian, setError, onClose,
}) => {
  const handleClose = () => onClose(0);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">General form constraints</div>
      <button className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <div className="rightsidebar-input-text-3part1">Cell</div>
      <div className="rightsidebar-input-text-3part2">Direction</div>
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
        cell={dir}
        onSetCell={setDir}
        classname="rightsidebar-input-3part2"
        placeholder="B1:B2"
        onValidate={validateCellorSingleRange}
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
      <div className="rightsidebar-input-text-1part1">Jacobian (optional)</div>
      <CellReference
        cell={jacobian}
        onSetCell={setJacobian}
        classname="rightsidebar-input-1part1"
        placeholder="D1"
        onValidate={validateCell}
        onSetError={setError}
      />
      <div className="rightsidebar-text-margin">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Fconstraint);
