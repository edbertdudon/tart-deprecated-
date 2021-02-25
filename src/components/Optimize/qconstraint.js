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
import { validateRangeNotOne, validateCellorSingleRange } from './index';

const Qconstraint = ({
  slides, isActive, quadratic, linear, dir, rhs, error,
  setQuadratic, setLinear, setDir, setRhs, setError, onClose,
}) => {
  const handleClose = () => onClose(3);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">Quadratic constraints</div>
      <button className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      <div className="rightsidebar-input-text-2part1">Quadratic</div>
      <div className="rightsidebar-input-text-2part2">Linear (optional)</div>
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
      <div className="rightsidebar-input-text-2part1">Direction</div>
      <div className="rightsidebar-input-text-2part2">Numeric</div>
      <CellReference
        cell={dir}
        onSetCell={setDir}
        classname="rightsidebar-input-2part1"
        placeholder="C1:C2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <CellReference
        cell={rhs}
        onSetCell={setRhs}
        classname="rightsidebar-input-2part2"
        placeholder="D1:D2"
        onValidate={validateCellorSingleRange}
        onSetError={setError}
      />
      <div className="rightsidebar-text">
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
)(Qconstraint);
