//
//  Linear Objective
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import CellReference from '../RightSidebar/cellreference';
import { validateCellorSingleRange } from './validate';

const Linear = ({
  dataNames, linear, error, setLinear, setError,
}) => (
  <>
    <div className="rightsidebar-label">Linear objective</div>
    <CellReference
      text="Linear:"
      cell={linear}
      onSetCell={setLinear}
      placeholder="A1:A2"
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
)(Linear);
