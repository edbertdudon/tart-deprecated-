//
//  Conic Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js'
import { validateCellRange, validateCellText } from './index'
import withListsXS from './withListsXS'

const Cconstraint = ({ lhs, setLhs, cone, setCone, rhs, setRhs, type, onClose }) => {
  const [error, setError] = useState(null)

  const handleUpdateLhs = e => {
    const v = e.target.value
    setLhs(v)
    setError(validateCellRange(v))
  }

  const handleUpdateCone = e => {
    const v = e.target.value
    setCone(v)
    if (isNaN(v)) {
      setError("Cone must be numeric.")
    }
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

  return (
    <>
      <div className='rightsidebar-label'>{type}</div>
      <button className='rightsidebar-label-close' onClick={onClose}>
        <Icon path={mdiClose} size={0.8}/>
      </button>
      <div className='rightsidebar-input-text-3part1'>Linear matrix</div>
      <div className='rightsidebar-input-text-3part2'># of variables</div>
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
const OptionsWithLists = withListsXS(Options)

export default Cconstraint
