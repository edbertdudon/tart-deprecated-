//
//  General Form Constraints
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import CellReference from '../RightSidebar/cellreference';
import { validateRangeNotOne, validateCellorSingleRange } from './validate';

const Qconstraint = ({
  dataNames, isActive, quadratic, linear, dir, rhs, error,
  setQuadratic, setLinear, setDir, setRhs, setError, onClose,
}) => {
  const handleClose = () => onClose(3);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">Quadratic constraints</div>
      <button type="button" className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <CellReference
        text="Quadratic:"
        cell={quadratic}
        onSetCell={setQuadratic}
        placeholder="A1:A2"
        onValidate={(v) => validateRangeNotOne(dataNames, v)}
        onSetError={setError}
      />
      <CellReference
        text="Linear (optional):"
        cell={linear}
        onSetCell={setLinear}
        placeholder="B1:B2"
        onValidate={(v) => validateCellorSingleRange(dataNames, v)}
        onSetError={setError}
      />
      <CellReference
        text="Direction:"
        cell={dir}
        onSetCell={setDir}
        placeholder="C1:C2"
        onValidate={(v) => validateCellorSingleRange(dataNames, v)}
        onSetError={setError}
      />
      <CellReference
        text="Numeric:"
        cell={rhs}
        onSetCell={setRhs}
        placeholder="D1:D2"
        onValidate={(v) => validateCellorSingleRange(dataNames, v)}
        onSetError={setError}
      />
      <div className="rightsidebar-text">
        {error && <div className="rightsidebar-error">{error}</div>}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Qconstraint);
