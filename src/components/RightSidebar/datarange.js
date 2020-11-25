//
//  Data Range
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { updateCellorRange } from './Optimize'

const DataRange = ({ datarange, setDatarange, error, setError }) => {
  const handleUpdateDatarange = e => updateCellorRange(e, setDatarange, setError)

  return (
    <>
      <div className='rightsidebar-label'>Data Range</div>
      <input
        type="text"
        className='rightsidebar-input-1part1'
        onChange={handleUpdateDatarange}
        value={datarange}
        placeholder="A1:A2"
      />
      <div className='rightsidebar-text'>
        {error && <div className='rightsidebar-error'>{error}</div>}
      </div>
    </>
  )
}

export default DataRange
