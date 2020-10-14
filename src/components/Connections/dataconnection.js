//  DataConnection
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
// Known Issues:
// Download button produces json link instead of a file pdf, excel, txt, csv, etc.
//

import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import Icon from '@mdi/react';
import { mdiDatabase, mdiDotsHorizontal } from '@mdi/js'
import withDropdown from '../Dropdown';
import { OFF_COLOR } from '../../constants/off-color'
import { withFirebase } from '../Firebase'

const DATASOURCE_DROPDOWN = [
	{key: 'Move to trash', type: 'item'},
]

const DataConnection = ({ firebase, authUser, color, filename, onReload }) => {
	const [hover, setHover] = useState(false)
	const [hoverDropdown, setHoverDropdown] = useState(false)

	const handleTrash = () => {
		let today = new Date().toLocaleDateString()
		firebase.trash(authUser.uid).get().then(doc => {
			if (doc.exists) {
				firebase.trash(authUser.uid).update({ [filename]: today })
			} else {
				firebase.trash(authUser.uid).set({ [filename]: today })
			}
		})
		onReload(filename)
	}

	const handleOpen = () => onSetWorksheetname(filename, authUser.uid)

	const ContextMenuDropdown = () => (
		<ContextMenu id={'right-click' + filename}>
			<MenuItem onClick={handleTrash}>Move to Trash</MenuItem>
		</ContextMenu>
	)

	return (
		<div className='datasource-thumbnail'>
			<ContextMenuTrigger className='datasource-dropdown' id={'right-click' + filename}>
				<div className='datasource-icon'>
					<Icon path={mdiDatabase} size={5}/>
				</div>
				<div className='datasource-buttons-wrapper'>
					<OptionWithDropdown
						text={<Icon path={mdiDotsHorizontal} size={0.9} />}
						items={DATASOURCE_DROPDOWN}
						onOpen={handleTrash}
						classname='datasource-options-only'
						color={OFF_COLOR[color[authUser.uid]]}
						style={{ left: "13px" }}
					/>
				</div>
				<div className='datasource-editabletext'>{filename}</div>
			</ContextMenuTrigger>
			<ContextMenuDropdown />
    </div>
	)
}

const Option = ({ classname, text, hover, onHover, isOpen, onOpen, color }) => (
	<div
		className={classname}
		onClick={onOpen}
		onMouseEnter={onHover}
		onMouseLeave={onHover}
		style={{ backgroundColor: hover && color }}
	>
		{text}
	</div>
)

const OptionWithDropdown = withDropdown(Option)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	worksheetname: (state.worksheetnameState.worksheetname || ''),
	color: (state.colorState.colors || {}),
	files: (state.filesState.files || {}),
	jobs: (state.jobsState.jobs || [{status:'failed list jobs'}]),
});

const mapDispatchToProps = dispatch => ({
	onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
	onSetJobs: (jobs) => dispatch({type: 'JOBS_SET', jobs}),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(DataConnection)
