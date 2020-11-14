import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'

import withDropdown from '../Dropdown';
import { withFirebase } from '../Firebase'
import { OFF_COLOR } from '../../constants/off-color'
import * as ROUTES from '../../constants/routes'

const USER_DROPDOWN = [
	{key: 'Sign out', type: 'item'},
	{key: 'Settings', type: 'link', path: ROUTES.SETTINGS}
]

const Header = ({ firebase, authUser, color }) => {
	const handleDropdown = i => firebase.doSignOut()

	return (
	  <div className='home-header'>
			<UserWithDropdown
				text={authUser.firstname}
				items={USER_DROPDOWN}
				onSelect={handleDropdown}
				color={OFF_COLOR[color[authUser.uid]]}
				style={{marginLeft: 'calc(100% - 195px)'}}
			/>
	  </div>
	)
}

const User = ({ text, hover, onHover, isOpen, onOpen, color }) => (
	<div
		className='home-header-user'
		onClick={onOpen}
		onMouseEnter={onHover}
		onMouseLeave={onHover}
		style={{ color: (hover || isOpen) && color }}
	>{text}</div>
)

const UserWithDropdown = withDropdown(User)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
});

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
	)
)(Header)
