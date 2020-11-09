//
//  Quadratic
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { validateRange, validateCellRange } from './index'

const Quadratic = ({ quadratic, setQuadratic, linear, setLinear, error, setError }) => {
  const handleUpdateQuadratic = e => {
    const v = e.target.value
    setQuadratic(v)
    setError(validateRange(v))
  }

  const handleUpdateLinear = e => {
    const v = e.target.value
    setLinear(v)
    setError(validateCellRange(v))
  }

  return (
    <>
      <div className='rightsidebar-label'>Quadratic objective</div>
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
      <div className='rightsidebar-text'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
    </>
  )
}

export default Quadratic
