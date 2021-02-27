//
//  Bounds
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Icon from '@mdi/react';
import { mdiClose, mdiLessThanOrEqual } from '@mdi/js';
import CellReference from '../RightSidebar/cellreference';
import { validateCell, validateCellorSingleRange } from './validate';

const General = ({
  lhs, dir, rhs, setLhs, setDir, setRhs, setError
}) => (
  <>
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
  </>
);

const QuadraticLinear = ({
  li, lb, ui, ub, ld, ud, setLi, setLb,
  setUi, setUb, setLd, setUd, setError
}) => (
  <>
    <div className="rightsidebar-input-text-2part1">Lower index (optional)</div>
    <div className="rightsidebar-input-text-2part2">Lower bound (optional)</div>
    <CellReference
      cell={li}
      onSetCell={setLi}
      classname="rightsidebar-input-2part1"
      placeholder="A1:A2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <CellReference
      cell={lb}
      onSetCell={setLb}
      classname="rightsidebar-input-2part2"
      placeholder="B1:B2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <div className="rightsidebar-input-text-2part1">Upper index (optional)</div>
    <div className="rightsidebar-input-text-2part2">Upper bound (optional)</div>
    <CellReference
      cell={ui}
      onSetCell={setUi}
      classname="rightsidebar-input-2part1"
      placeholder="C1:C2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <CellReference
      cell={ub}
      onSetCell={setUb}
      classname="rightsidebar-input-2part2"
      placeholder="D1:D2"
      onValidate={validateCellorSingleRange}
      onSetError={setError}
    />
    <div className="rightsidebar-input-text-2part1">Lower limit (optional)</div>
    <div className="rightsidebar-input-text-2part2">Upper limit (optional)</div>
    <CellReference
      cell={ld}
      onSetCell={setLd}
      classname="rightsidebar-input-2part1"
      placeholder="D1"
      onValidate={validateCell}
      onSetError={setError}
    />
    <CellReference
      cell={ud}
      onSetCell={setUd}
      classname="rightsidebar-input-2part2"
      placeholder="E1"
      onValidate={validateCell}
      onSetError={setError}
    />
  </>
);

const Bounds = ({
  slides, isActive, objectiveClass, lhs, dir, rhs, li, lb, ui, ub, ld, ud, error,
  setLhs, setDir, setRhs, setLi, setLb, setUi, setUb, setLd, setUd, setError, onClose,
}) => {
  const handleClose = () => onClose(1);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">Bounds</div>
      <button className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      {objectiveClass === 0
        ? <General
            lhs={lhs}
            dir={dir}
            rhs={rhs}
            setLhs={setLhs}
            setDir={setDir}
            setRhs={setRhs}
            setError={setError}
          />
        : (
          <QuadraticLinear
            li={li}
            lb={lb}
            ui={ui}
            ub={ub}
            ld={ld}
            ud={ud}
            setLi={setLi}
            setLb={setLb}
            setUi={setUi}
            setUb={setUb}
            setLd={setLd}
            setUd={setUd}
            setError={setError}
          />
        )}
      <div className="rightsidebar-subtext">
        Use -Inf or Inf for infinity.
      </div>
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
)(Bounds);
