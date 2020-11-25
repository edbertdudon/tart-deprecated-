//
//  General Form Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js'
import { updateRange, updateCellorRange } from './index'

const Qconstraint = ({ slides, quadratic, setQuadratic, linear, setLinear, dir, setDir, rhs, setRhs, onClose, error, setError }) => {
  const handleUpdateQuadratic = e => updateRange(e, setQuadratic, setError)

  const handleUpdateLinear = e => updateCellorRange(e, setLinear, setError)

  const handleUpdateDir = e => updateCellorRange(e, setDir, setError)

  const handleUpdateRhs = e => updateCellorRange(e, setRhs, setError)

  const handleClose = () => onClose(3)

  return (
    <>
      <div className='rightsidebar-label'>Quadratic constraints</div>
      <button className='rightsidebar-label-close' onClick={handleClose}>
        <Icon path={mdiClose} size={0.8}/>
      </button>
      <div className='rightsidebar-input-text-2part1'>Quadratic matrix</div>
      <div className='rightsidebar-input-text-2part2'>Linear matrix</div>
      <input
        type="text"
        className='rightsidebar-input-2part1'
        onChange={handleUpdateQuadratic}
        value={quadratic}
        placeholder="A1:A2"
      />
      <input
        type="text"
        className='rightsidebar-input-2part2'
        onChange={handleUpdateLinear}
        value={linear}
        placeholder="B1:B2"
      />
      <div className='rightsidebar-input-text-2part1'>direction range</div>
      <div className='rightsidebar-input-text-2part2'>Numeric range</div>
      <input
        type="text"
        className='rightsidebar-input-2part1'
        onChange={handleUpdateDir}
        value={dir}
        placeholder="C1:C2"
      />
      <input
        type="text"
        className='rightsidebar-input-2part2'
        onChange={handleUpdateRhs}
        value={rhs}
        placeholder="D1:D2"
      />
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
)(Qconstraint)
