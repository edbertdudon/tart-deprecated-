//
//  Bounds
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
import { validateCell, validateCellorSingleRange } from './validate';

const General = ({
  dataNames, lhs, dir, rhs, setLhs, setDir, setRhs, setError,
}) => (
  <>
    <CellReference
      text="Cell:"
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
  </>
);

const QuadraticLinear = ({
  dataNames, li, lb, ui, ub, ld, ud, setLi, setLb,
  setUi, setUb, setLd, setUd, setError,
}) => (
  <>
    <CellReference
      text="Lower index (optional):"
      cell={li}
      onSetCell={setLi}
      placeholder="A1:A2"
      onValidate={(v) => validateCellorSingleRange(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Lower bound (optional):"
      cell={lb}
      onSetCell={setLb}
      placeholder="B1:B2"
      onValidate={(v) => validateCellorSingleRange(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Upper index (optional):"
      cell={ui}
      onSetCell={setUi}
      placeholder="C1:C2"
      onValidate={(v) => validateCellorSingleRange(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Upper bound (optional):"
      cell={ub}
      onSetCell={setUb}
      placeholder="D1:D2"
      onValidate={(v) => validateCellorSingleRange(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Lower limit (optional):"
      cell={ld}
      onSetCell={setLd}
      part="2part1"
      placeholder="D1"
      onValidate={(v) => validateCell(dataNames, v)}
      onSetError={setError}
    />
    <CellReference
      text="Upper limit (optional):"
      cell={ud}
      onSetCell={setUd}
      part="2part2"
      placeholder="E1"
      onValidate={(v) => validateCell(dataNames, v)}
      onSetError={setError}
    />
  </>
);

const Bounds = ({
  dataNames, isActive, objectiveClass, lhs, dir, rhs, li, lb, ui, ub, ld, ud, error,
  setLhs, setDir, setRhs, setLi, setLb, setUi, setUb, setLd, setUd, setError, onClose,
}) => {
  const handleClose = () => onClose(1);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <div className="rightsidebar-label">Bounds</div>
      <button type="button" className="rightsidebar-label-close" onClick={handleClose}>
        <Icon path={mdiClose} size={0.8} />
      </button>
      {objectiveClass === 0 ? (
        <General
          dataNames={dataNames}
          lhs={lhs}
          dir={dir}
          rhs={rhs}
          setLhs={setLhs}
          setDir={setDir}
          setRhs={setRhs}
          setError={setError}
        />
      ) : (
        <QuadraticLinear
          dataNames={dataNames}
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
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Bounds);
