//
//  Formulabar
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import './index.less'

const Formulabar = ({ slides }) => {
  useEffect(() => {
    console.log(slides)
  }, [])

  const handleChange = () => {

  }
// value={slides.data.rows(slides.data.selector.ri, slides.data.selector.ci)}
  return (
    <input
			type="text"
			className="formulabar"
      value='asdfqwer'
		/>
  )
}

const mapStateToProps = state => ({
	slides: (state.slidesState.slides || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(Formulabar)
