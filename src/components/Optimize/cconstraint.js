//
//  Conic Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js'
import { updateCellorSingleRange, updateCell } from './index'

const Cconstraint = ({ lhs, cone, rhs, setLhs, setCone, setRhs, type, onClose, error, setError }) => {
  const handleUpdateLhs = e => updateCellorSingleRange(e, setLhs, setError)

  // const handleUpdateCone = e => {
  //   const v = e.target.value
  //   setCone(v)
  //   if (isNaN(v)) {
  //     setError("Cone must be numeric (e.g., 1 for K_expp(1), 1/4 for K_powp(1/4)).")
  //   }
  // }

  const handleUpdateCone = e => updateCell(e, setCone, setError)

  const handleUpdateRhs = e => updateCellorSingleRange(e, setRhs, setError)

  // <div className='rightsidebar-input-text-2part1'>Linear matrix</div>
  // <div className='rightsidebar-input-text-2part2'>Numeric range</div>
  // <input
  //   type="text"
  //   className='rightsidebar-input-2part1'
  //   onChange={handleUpdateLhs}
  //   value={lhs}
  //   placeholder="A1:A2"
  // />
  // <input
  //   type="text"
  //   className='rightsidebar-input-2part2'
  //   onChange={handleUpdateRhs}
  //   value={rhs}
  //   placeholder="B1:B2"
  // />

  return (
    <>
      <div className='rightsidebar-label'>{type}</div>
      <button className='rightsidebar-label-close' onClick={onClose}>
        <Icon path={mdiClose} size={0.8}/>
      </button>
      <div className='rightsidebar-input-text-3part1'>Linear matrix</div>
      <div className='rightsidebar-input-text-3part2'>cone</div>
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
        onChange={handleUpdateCone}
        value={cone}
        placeholder="1"
      />
      <input
        type="text"
        className='rightsidebar-input-3part3'
        onChange={handleUpdateRhs}
        value={rhs}
        placeholder="C1:C2"
      />
      <div className='rightsidebar-text'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
    </>
  )
}

const Options = ({ option }) => option

export default Cconstraint
