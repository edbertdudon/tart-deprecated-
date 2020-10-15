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
import { mdilFile, mdilTable } from '@mdi/light-js'
import { mdiDatabase, mdiDotsHorizontal } from '@mdi/js'

import { OFF_COLOR } from '../../constants/off-color'
import { withFirebase } from '../Firebase'
import withDropdown from '../Dropdown';
import withModal from '../Modal'

const DATASOURCE_DROPDOWN = [
	{key: 'Delete', type: 'item'},
	{key: 'Move back', type: 'item'},
]

const DataTrash = ({ firebase, authUser, color, filename, onReload, connections }) => {
	const [hoverDropdown, setHoverDropdown] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const handleDropdown = key => {
		switch(key) {
			case 'Delete':
				setIsOpen(!isOpen)
				break;
			case 'Move back':
				firebase.doDeleteTrashField(authUser.uid, filename)
				onReload(filename)
				break;
		}
	}

	const handleMoveBack = () => {
		firebase.doDeleteTrashField(authUser.uid, filename)
		onReload(filename)
	}

	const handleDelete = () => {
		if (connections.includes(filename)) {
			firebase.doDeleteConnectionsField(authUser.uid, filename)
		} else {
			firebase.doDeleteFile(authUser.uid, filename)
		}
		onReload(filename)
	}

	const handleOpen = () => setIsOpen(true)

	const ContextMenuDropdown = () => (
		<ContextMenu id={'right-click' + filename}>
			<MenuItem onClick={handleOpen}>Delete</MenuItem>
			<MenuItem onClick={handleMoveBack}>Move Back</MenuItem>
		</ContextMenu>
	)

	return (
		<div className='datasource-thumbnail'>
			<ContextMenuTrigger className='datasource-dropdown' id={'right-click' + filename}>
				<div className='datasource-icon'>
						{connections.includes(filename)
							? <Icon path={mdiDatabase} size={5}/>
							: (/[.]/.exec(filename) == null)
								? <Icon path={mdilTable} size={5}/>
								: <Icon path={mdilFile} size={5}/>
						}
				</div>
				<div className='datasource-buttons-wrapper'>
					<OptionWithDropdown
						text={<Icon path={mdiDotsHorizontal} size={0.9} />}
						items={DATASOURCE_DROPDOWN}
						onSelect={handleDropdown}
						classname='datasource-options-only'
						color={OFF_COLOR[color[authUser.uid]]}
						style={{ left: "13px" }}
					/>
				</div>
				<div className='datasource-editabletext'>{filename.replace(/\.[^/.]+$/, "")}</div>
			</ContextMenuTrigger>
			<ContextMenuDropdown />
			<VerifyDeleteWithModal height='140px' filname={filename} onSelect={handleDelete} isOpen={isOpen} setIsOpen={setIsOpen}/>
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

const VerifyDelete = ({ filename, onDelete, onClose, onSelect }) => (
	<form className='modal-form'>
		<h3>{'Are you sure you want to delete "' + filename + '"?'}</h3>
		<p>This item will be deleted immediately. You can't undo this action.</p>
		<input
			className='modal-button'
			type="button"
			value="Delete"
			onClick={onSelect}
		/>
		<input
			className='modal-button'
			type="button"
			value="Cancel"
			onClick={onClose}
			style={{color: "#0071e3"}}
		/>
	</form>
)

const OptionWithDropdown = withDropdown(Option)
const VerifyDeleteWithModal = withModal(VerifyDelete)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
});

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
	),
)(DataTrash)
