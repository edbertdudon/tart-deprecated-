//
//  Linear Objective
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { updateCellorRange } from './index'

const Linear = ({ linear, setLinear, error, setError }) => {
  const handleUpdateLinear = e => updateCellorRange(e, setLinear, setError)

  return (
    <>
      <div className='rightsidebar-label'>Linear objective</div>
      <div className='rightsidebar-input-text-1part1'>Linear matrix</div>
      <input
        type="text"
        className='rightsidebar-input-1part1'
        onChange={handleUpdateLinear}
        value={linear}
        placeholder="A1:A2"
      />
      <div className='rightsidebar-text'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
    </>
  )
}

export default Linear
