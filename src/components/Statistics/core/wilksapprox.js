//
//  WilksApproximation
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { WILKS_APPROXIMATION } from './form'

const WilksApproximation = ({ authUser, color, setMethod, method }) => {

	const handleMethod0 = () => setMethod(0)

	const handleMethod1 = () => setMethod(1)

	const handleMethod2 = () => setMethod(2)

	return (
		<>
			<div className='rightsidebar-label'>Approximation</div>
	    <Button onClick={handleMethod0} condition={method === 0} text={WILKS_APPROXIMATION[0]} color={color[authUser.uid]} />
	    <Button onClick={handleMethod1} condition={method === 1} text={WILKS_APPROXIMATION[1]} color={color[authUser.uid]} />
			<Button onClick={handleMethod2} condition={method === 2} text={WILKS_APPROXIMATION[2]} color={color[authUser.uid]} />
		</>
	)
}

const Button = ({ onClick, condition, text, color }) => (
	<div className='rightsidebar-buttonwrapper' onClick={onClick}>
		<button className='rightsidebar-button'
			style={{
				backgroundColor: condition === true && color,
				boxShadow: condition === true ? 'inset 0px 0px 0px 3px #fff' : 'none',
				border: condition === true ? '1px solid '+ color : '1px solid #fff'
			}}
		></button>
	<div className='rightsidebar-buttontext-2part-wilksapprox'>{text}</div>
	</div>
)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
	connect(
		mapStateToProps,
	),
)(WilksApproximation)
