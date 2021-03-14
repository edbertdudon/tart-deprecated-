//
//  Linear Constraints
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
import { validateCellorSingleRange } from './validate';

const Lconstraint = ({
  dataNames, isActive, lhs, dir, rhs, error, setLhs, setDir, setRhs, setError, onClose,
}) => {
  const handleClose = () => onClose(2);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">Linear constraints</div>
      <button type="button" className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <CellReference
        text="Linear:"
        cell={lhs}
        onSetCell={setLhs}
        placeholder="A1:A2"
        onValidate={(v) => validateCellorSingleRange(dataNames, v)}
        onSetError={setError}
      />
      <CellReference
        text="Direction:"
        cell={dir}
        onSetCell={setDir}
        placeholder="B1:B2"
        onValidate={(v) => validateCellorSingleRange(dataNames, v)}
        onSetError={setError}
      />
      <CellReference
        text="Numeric:"
        cell={rhs}
        onSetCell={setRhs}
        placeholder="C1:C2"
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
)(Lconstraint);
