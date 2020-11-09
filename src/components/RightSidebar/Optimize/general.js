//
//  General Objective
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { validateCell, validateCellRange } from './index'

const General = ({ objective, setObjective, decision, setDecision, gradient, setGradient, hessian, setHessian, error, setError }) => {
  const handleUpdateObjective = e => {
    const v = e.target.value
    setObjective(v)
    setError(validateCell(v))
  }

  const handleUpdateDecision = e => {
    const v = e.target.value
    setDecision(v)
    setError(validateCellRange(v))
  }

  const handleUpdateGradient = e => {
    const v = e.target.value
    setGradient(v)
    setError(validateCell(v))
  }

  const handleUpdateHessian = e => {
    const v = e.target.value
    setHessian(v)
    setError(validateCell(v))
  }

  return (
    <>
      <div className='rightsidebar-label'>General nonlinear objective</div>
      <div className='rightsidebar-input-text-2part1'>Objective cell</div>
      <div className='rightsidebar-input-text-2part2'>Decision range</div>
      <input
        type="text"
        className='rightsidebar-input-2part1'
        onChange={handleUpdateObjective}
        value={objective}
        placeholder="A1"
      />
      <input
        type="text"
        className='rightsidebar-input-2part2'
        onChange={handleUpdateDecision}
        value={decision}
        placeholder="B1:B2"
      />
      <div className='rightsidebar-input-text-2part1'>Gradient cell (optional)</div>
      <div className='rightsidebar-input-text-2part2'>Hessian cell (optional)</div>
      <input
        type="text"
        className='rightsidebar-input-2part1'
        onChange={handleUpdateGradient}
        value={gradient}
        placeholder="C1"
      />
      <input
        type="text"
        className='rightsidebar-input-2part2'
        onChange={handleUpdateHessian}
        value={hessian}
        placeholder="D1"
      />
    {error && <div className='rightsidebar-error'>{error}</div>}
    </>
  )
}

export default General
