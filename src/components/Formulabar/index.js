//
//  Formulabar
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import './index.less'

const Formulabar = ({ text }) => (
  <input
		type="text"
		className="formulabar"
    value={text}
	/>
)

export default Formulabar
