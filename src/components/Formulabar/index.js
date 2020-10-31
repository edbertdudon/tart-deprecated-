//
//  Formulabar
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import './index.less'

const Formulabar = ({ slides, text }) => {
  // const [value, setValue] = useState(text.text)
  const handleChange = e => {
    // setValue(e.target.value)
    // slides.setCellText(text.ri, text.ci, e.target.value).reRender()
  }

  return (
    <input
  		type="text"
      onChange={handleChange}
  		className="formulabar"
      value={text.text}
  	/>
  )
}

const mapStateToProps = state => ({
  slides: (state.slidesState.slides || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(Formulabar)
