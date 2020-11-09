//
//  Bounds
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiClose, mdiLessThanOrEqual } from '@mdi/js'
import { validateCellRange, validateCellText } from './index'

const Bounds = ({ slides, lower, setLower, decision, setDecision, upper, setUpper, onClose }) => {
  const [error, setError] = useState(null)

  const handleUpdateLower = e => {
    const v = e.target.value
    setLower(v)
    setError(
      validateCellText(v, slides, (cellText) => {
        if (isNaN(cellText) || cellText !== "-Inf" || cellText !== "-inf") {
          return("Range must be numeric.")
        }
      })
    )
  }

  const handleUpdateDecision = e => {
    const v = e.target.value
    setDecision(v)
    setError(validateCellRange(v))
  }

  const handleUpdateUpper = e => {
    const v = e.target.value
    setUpper(v)
    setError(
      validateCellText(v, slides, (cellText) => {
        if (isNaN(cellText) || cellText !== "Inf" || cellText !== "-inf") {
          return("Range must be numeric.")
        }
      })
    )
  }

  const handleClose = () => onClose(0)

  return (
    <>
      <div className='rightsidebar-label'>Bounds</div>
      <button className='rightsidebar-label-close' onClick={handleClose}>
        <Icon path={mdiClose} size={0.8}/>
      </button>
      <div className='rightsidebar-input-text-3Spart1'>Lower bound</div>
      <div className='rightsidebar-input-text-3Spart2'>Decision</div>
      <div className='rightsidebar-input-text-3Spart3'>Upper bound</div>
      <input
        type="text"
        className='rightsidebar-input-3Spart1'
        onChange={handleUpdateLower}
        value={lower}
        placeholder="A1:A2"
      />
      <div className='rightsidebar-divider'>
        <Icon path={mdiLessThanOrEqual} size={0.7}/>
      </div>
      <input
        type="text"
        className='rightsidebar-input-3Spart2'
        onChange={handleUpdateDecision}
        value={decision}
        placeholder="B1,B2"
      />
      <div className='rightsidebar-divider'>
        <Icon path={mdiLessThanOrEqual} size={0.7}/>
      </div>
      <input
        type="text"
        className='rightsidebar-input-3Spart3'
        onChange={handleUpdateUpper}
        value={upper}
        placeholder="C1:C2"
      />
      <div className='rightsidebar-subtext'>
        Use -Inf or Inf for infinity.
      </div>
      <div className='rightsidebar-text'>
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
)(Bounds)
