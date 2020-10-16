import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'
import * as ROUTES from '../../constants/routes'
import { withFirebase } from '../Firebase'

export const INSERT_DROPDOWN = [
	{key: 'Sheet', type: 'item'},
	{key: 'Chart', type: 'item'},
	{key: 'Statistics', type: 'item'},
	{key: 'Function', type: 'item'},
	{type: 'divider'},
	{key: 'Import csv or xlsx', type: 'item'},
	{key: 'Import connection', type: 'item'},
]

const Insert = ({ color, authUser }) => {
	const handleInsert = key => {
		switch(key) {
			case 'Sheet':
				break;
			case 'Chart':
				break;
			case 'Statistics':
				break;
			case 'Function':
				break;
			case 'Import csv or xlsx':
				break;
			case 'Import connection':
				break;
		}
	}

	return (
    <InsertWithDropdown
    	items={INSERT_DROPDOWN}
    	onSelect={handleInsert}
    	classname='worksheet-header-dropdown-header'
			color={OFF_COLOR[color[authUser.uid]]}
    />
	)
}

const Header = ({ classname, hover, onHover, isOpen, onOpen, color }) => (
	<div
		className={classname}
		onClick={onOpen}
		onMouseEnter={onHover}
		onMouseLeave={onHover}
		style={{ color: (hover || isOpen) && color }}
	>
		Insert
	</div>
)

const InsertWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
})

export default compose(
	connect(
		mapStateToProps,
	),
	withFirebase,
)(Insert)
