//
//  General Form Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js'
import { validateCell, validateCellRange, validateCellText } from './index'

const Fconstraint = ({ slides, lhs, setLhs, dir, setDir, rhs, setRhs, jacobian, setJacobian, onClose }) => {
  const [error, setError] = useState(null)

  const handleUpdateLhs = e => {
    const v = e.target.value
    setLhs(v)
    setError(validateCellRange(v))
  }

  const handleUpdateDir = e => {
    const v = e.target.value
    setDir(v)
    setError(
      validateCellText(v, slides, (cellText) => {
        if (cellText !== "=" || cellText !== "<=" || cellText !== ">=") {
          return("Direction must be =, <= or >=.")
        }
      })
    )
  }

  const handleUpdateRhs = e => {
    const v = e.target.value
    setRhs(v)
    setError(
      validateCellText(v, slides, (cellText) => {
        if (isNaN(cellText)) {
          return("Range must be numeric.")
        }
      })
    )
  }

  const handleUpdateJacobian = e => {
    const v = e.target.value
    setJacobian(v)
    setError(validateCell(v))
  }

  return (
    <>
      <div className='rightsidebar-label'>General form constraints</div>
      <button className='rightsidebar-label-close' onClick={() => onClose(0)}>
        <Icon path={mdiClose} size={0.8}/>
      </button>
      <div className='rightsidebar-input-text-3part1'>Cell range</div>
      <div className='rightsidebar-input-text-3part2'>direction range</div>
      <div className='rightsidebar-input-text-3part3'>Numeric range</div>
      <input
        type="text"
        className='rightsidebar-input-3part1'
        onChange={handleUpdateLhs}
        value={lhs}
        placeholder="A1:A2"
      />
      <input
        type="text"
        className='rightsidebar-input-3part2'
        onChange={handleUpdateDir}
        value={dir}
        placeholder="B1:B2"
      />
      <input
        type="text"
        className='rightsidebar-input-3part3'
        onChange={handleUpdateRhs}
        value={rhs}
        placeholder="C1:C2"
      />
      <div className='rightsidebar-input-text-1part1'>Jacobian (optional)</div>
      <input
        type="text"
        className='rightsidebar-input-1part1'
        onChange={handleUpdateJacobian}
        value={jacobian}
        placeholder="D1"
      />
      <div className='rightsidebar-text-margin'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
    </>
  )
}

const mapStateToProps = state => ({
	slides: (state.slidesState.slides || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(Fconstraint)
