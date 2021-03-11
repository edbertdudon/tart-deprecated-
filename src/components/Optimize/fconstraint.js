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
  isActive, lhs, dir, rhs, jacobian, error,
  setLhs, setDir, setRhs, setJacobian, setError, onClose,
}) => {
  const handleClose = () => onClose(0);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">General form constraints</div>
      <button type="button" className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <CellReference
        text="Cell:"
        cell={lhs}
        onSetCell={setLhs}
        placeholder="A1:A2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <CellReference
        text="Direction:"
        cell={dir}
        onSetCell={setDir}
        placeholder="B1:B2"
        onValidate={validateCellorSingleRange}
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
      <CellReference
        text="Jacobian (optional):"
        cell={jacobian}
        onSetCell={setJacobian}
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
