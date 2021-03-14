//
//  Quadratic
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import CellReference from '../RightSidebar/cellreference';
import { validateRangeNotOne, validateCellorSingleRange } from './validate';

const Quadratic = ({
  dataNames, quadratic, linear, error, setQuadratic, setLinear, setError,
}) => (
  <>
    <div className="rightsidebar-label">Quadratic objective</div>
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
    <div className="rightsidebar-text">
      {error && <div className="rightsidebar-error">{error}</div>}
    </div>
  </>
);

const mapStateToProps = (state) => ({
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Quadratic);
