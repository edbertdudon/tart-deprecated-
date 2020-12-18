//
//  Quadratic
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { updateRangeNotOne, updateCellorSingleRange } from './index'

const Quadratic = ({ quadratic, linear, error, setQuadratic, setLinear, setError }) => {
  const handleUpdateQuadratic = e => updateRangeNotOne(e, setQuadratic, setError)

  const handleUpdateLinear = e => updateCellorSingleRange(e, setLinear, setError)

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
