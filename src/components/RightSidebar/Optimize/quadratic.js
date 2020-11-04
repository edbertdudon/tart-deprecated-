//
//  Quadratic
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'

var FORMULA_CELL_REFERENCES = /\$?[A-Z]+\$?[0-9]*/g;
var RANGE_CELL_REFERENCE = /\$?[A-Z]+\$?[0-9]*:{1}\$?[A-Z]+\$?[0-9]*/g;

const Quadratic = ({ quadratic, setQuadratic, linear, setLinear }) => {
  const [errorQuad, setErrorQuad] = useState(null)
  const [errorLinear, setErrorLinear] = useState(null)

  const handleUpdateQuadratic = e => {
    const v = e.target.value
    const match = v.match(RANGE_CELL_REFERENCE)
    setQuadratic(v)
    if (match === null || match.length > 1) {
      setErrorQuad('Invalid range')
    }
  }

  const handleUpdateLinear = e => {
    const v = e.target.value
    const match = v.match(FORMULA_CELL_REFERENCES)
    const range = v.match(RANGE_CELL_REFERENCE)
    setLinear(v)
    if (match === null || range.length > 1) {
      setErrorLinear('Invalid cell or range')
    }
  }

  return (
    <>
      <div className='rightsidebar-label'>Quadratic portion in matrix form</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateQuadratic}
        value={quadratic}
        placeholder='Select range'
      />
      <div className='rightsidebar-text'>{errorQuad && <p>{errorQuad}</p>}</div>
      <div className='rightsidebar-label'>Linear portion in matrix form (optional)</div>
      <input
        type="text"
        className='rightsidebar-input'
        onChange={handleUpdateLinear}
        value={linear}
        placeholder='Select cell or range'
      />
      <div className='rightsidebar-text'>{errorLinear && <p>{errorLinear}</p>}</div>
    </>
  )
}

export default Quadratic
