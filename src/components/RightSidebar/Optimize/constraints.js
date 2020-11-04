//
//  Constraints
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'

const Constraints = ({ lhs, setLhs, dir, setDir, rhs, setRhs, jacobian, setJacobian }) => {
  const handleUpdateLhs = e => setLhs(e.target.value)

  const handleUpdateDir = e => setDir(e.target.value)

  const handleUpdateRhs = e => setRhs(e.target.value)

  const handleUpdateJacobian = e => setJacobian(e.target.value)

  return (
    <>
      <div className='rightsidebar-label'>Constraints left hand side</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateLhs}
        value={lhs}
      />
      <div className='rightsidebar-label'>{'Constraints direction =, <=, or >='}</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateDir}
        value={dir}
      />
      <div className='rightsidebar-label'>Constraints right hand side (numeric only)</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateRhs}
        value={rhs}
      />
      <div className='rightsidebar-label'>Jacobian of the constraints (optional)</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateJacobian}
        value={jacobian}
      />
    </>
  )
}

export default Constraints
