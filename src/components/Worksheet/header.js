import React, { useState, useEffect, useContext, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import EditableInput from '../EditableInput'
import withDropdown from '../Dropdown';
import { withFirebase } from '../Firebase'
import { OFF_COLOR } from '../../constants/off-color'
import * as ROUTES from '../../constants/routes'

const USER_DROPDOWN = [
	{key: 'Sign out', type: 'item'},
	{key: 'Settings', type: 'link', path: ROUTES.SETTINGS}
]

const Header = ({ firebase, authUser, color, worksheetname, files, onSetFiles, onSetWorksheetname }) => {
	// const {rename, setRename} = useContext(Context)

	useEffect(() => {
		if (files[authUser.uid] === undefined) {
			firebase.doListFiles(authUser.uid).then(res => {
				onSetFiles(res.items, authUser.uid)
			})
		}
	}, [])

	const handleChange = name => {
		// const file = new File ([JSON.stringify(slides)], name, {type: "application/json"})
		// firebase.doUploadFile(authUser.uid, name, file)
		// firebase.doDeleteFile(authUser.uid, worksheetname[authUser.uid])
		// onSetWorksheetname(name, authUser.uid)
	}

	const handleDropdown = i => firebase.doSignOut()

	// const handleSetRename = () => setRename(false)
	// rename={rename}
	// onSetRename={handleSetRename}
	return (
		<div className='worksheet-header'>
			<div className='worksheet-header-right'>
				<UserWithDropdown
					text={authUser.firstname}
					items={USER_DROPDOWN}
					onSelect={handleDropdown}
					style={{right:"10px"}}
					classname='worksheet-header-dropdown-header'
					color={OFF_COLOR[color[authUser.uid]]}
				/>
			</div>
			<div className='worksheet-header-center'>
				<EditableInput
					value={worksheetname.replace(/\.[^/.]+$/, "")}
					onCommit={handleChange}
					files={files[authUser.uid]}
					classname='worksheet-header-filename'
				/>
			</div>
		</div>
	)
}

const User = ({ classname, text, hover, onHover, isOpen, onOpen, color }) => (
	<div
		className={classname}
		onClick={onOpen}
		onMouseEnter={onHover}
		onMouseLeave={onHover}
		style={{ color: (hover || isOpen) && color }}
	>
		{text}
	</div>
)

const UserWithDropdown = withDropdown(User)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	worksheetname: (state.worksheetnameState.worksheetname || ''),
	files: (state.filesState.files || {}),
	color: (state.colorState.colors || {}),
});

const mapDispatchToProps = dispatch => ({
	onSetWorksheetname: worksheetname => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
)(Header)
