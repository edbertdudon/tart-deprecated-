//
//  General
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'

const General = ({ objective, setObjective, decision, setDecision, gradient, setGradient, hessian, setHessian }) => {

  const handleUpdateObjective = e => setObjective(e.target.value)

  const handleUpdateDecision = e => setDecision(e.target.value)

  const handleUpdateGradient = e => setGradient(e.target.value)

  const handleUpdateHessian = e => setHessian(e.target.value)

  return (
    <>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateObjective}
        value={objective}
      />
      <div className='rightsidebar-label'>Decision variables</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateDecision}
        value={decision}
      />
      <div className='rightsidebar-label'>Gradient of the objective (optional)</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateGradient}
        value={gradient}
      />
      <div className='rightsidebar-label'>Hessian of the objective (optional)</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateHessian}
        value={hessian}
      />
    </>
  )
}

export default General
