//
//  DataSource
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdilTable } from '@mdi/light-js'
import { mdiStop, mdiLoading, mdiDotsHorizontal } from '@mdi/js'

import { getMaxNumberCustomSheet, xtos, addCopyToName } from '../../functions'
import EditableInput from '../EditableInput'
import withDropdown from '../Dropdown';
import { OFF_COLOR } from '../../constants/off-color'
import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'

const DATASOURCE_DROPDOWN = [
	{key: 'Open', type: 'item'},
	{key: 'Duplicate', type: 'item'},
	{key: 'Rename', type: 'item'},
	{key: 'Download as xlsx', type: 'item'},
	{key: 'Move to trash', type: 'item'},
]

const Item = ({text, onDropdown }) => <MenuItem onClick={() => onDropdown(text)}>{text}</MenuItem>

const ContextMenuDropdown = ({ filename, onDropdown }) => (
	<ContextMenu id={'right-click' + filename}>
		<MenuItem onClick={() =>onDropdown(DATASOURCE_DROPDOWN[0].key)} onContextMenu={(e) => e.preventPropognation()}>
			{DATASOURCE_DROPDOWN[0].key}
		</MenuItem>
		<Item text={DATASOURCE_DROPDOWN[1].key} onDropdown={onDropdown} />
		<Item text={DATASOURCE_DROPDOWN[2].key} onDropdown={onDropdown} />
		<Item text={DATASOURCE_DROPDOWN[3].key} onDropdown={onDropdown} />
		<Item text={DATASOURCE_DROPDOWN[4].key} onDropdown={onDropdown} />
	</ContextMenu>
)

const DataSource = ({ firebase, authUser, color, files, jobs, onSetWorksheetname, onSetJobs,
	filename, onReload, runId,onJobSubmit, onJobCancel, onListFilesLessTrash, filesWithTrash }) => {
	const [loading, setLoading] = useState(false)
	const [name, setName] = useState(filename)
	const [hover, setHover] = useState(false)
	const [hoverDropdown, setHoverDropdown] = useState(false)
	const [readOnly, setReadOnly] = useState(true)

	const handleDropdown = key => {
		switch(key) {
			case DATASOURCE_DROPDOWN[0].key:
				onSetWorksheetname(filename)
				document.getElementById(`link-app-${filename}`).click()
				break;
			case DATASOURCE_DROPDOWN[1].key:
				const newname = addCopyToName(filesWithTrash, filename)
				firebase.doDownloadFile(authUser.uid, filename).then(slide => {
					const file = new File ([JSON.stringify(slide)], newname, {type: "application/json"})
					var uploadTask = firebase.doUploadFile(authUser.uid, newname, file)
					uploadTask.on('state_changed', function(){}, function(){}, snapshot => {
						onListFilesLessTrash()
					})
				})
				break;
			case DATASOURCE_DROPDOWN[2].key:
				setReadOnly(false)
				break;
			case DATASOURCE_DROPDOWN[3].key:
				firebase.doDownloadFile(authUser.uid, filename).then(slide => {
					xtos(slide, filename)
				})
				break;
			case DATASOURCE_DROPDOWN[4].key:
				let today = new Date().toLocaleDateString()
				firebase.trash(authUser.uid).get().then(doc => {
					if (doc.exists) {
						firebase.trash(authUser.uid).update({ [filename]: today })
					} else {
						firebase.trash(authUser.uid).set({ [filename]: today })
					}
				})
				onReload(filename)
				break;
		}
	}

	const handleRun = () => {
		onJobSubmit(filename)
		firebase.doRunWorksheet(
			authUser.uid,
			filename,
			'user/' + authUser.uid + '/' + filename,
			"gs://tart-90ca2.appspot.com/user/" + authUser.uid + "/",
			"gs://tart-90ca2.appspot.com/scripts/sparkR.R"
		).then(jobResp => {
			if (jobResp === 'failed job') onJobCancel(runId)
		})
	}

	const handleCancel = () => {
		onJobCancel(runId)
		firebase.doCancelWorksheet(
			runId,
			authUser.uid,
			filename.replace(/\s/g, '').toLowerCase()
		)
	}

	const handleRename = n => {
		setLoading(true)
		setName(n)
		firebase.doDownloadFile(authUser.uid, filename).then(slide => {
			firebase.doUploadFile(
				authUser.uid,
				n,
				new File ([JSON.stringify(slide)], n, {type: "application/json"})
			).then(() => {
				firebase.doDeleteFile(authUser.uid, filename).then(() => {
					// onListFilesLessTrash()
					setLoading(false)
					// onSetWorksheetname(n)
				})
			})
		})
	}

	const handleOpen = () => onSetWorksheetname(filename)

	const handleClose = () => setError('')

	const Run = () => (
		(runId === undefined || runId === "")
			?	<button
					className='datasource-button'
					onClick={handleRun}
					style={{backgroundColor: hover && OFF_COLOR[color[authUser.uid]]}}
					onMouseEnter={() => setHover(!hover)} onMouseLeave={() => setHover(!hover)}
				>RUN</button>
			:	<button className='datasource-button' onClick={handleCancel} style={{backgroundColor: OFF_COLOR[color[authUser.uid]]}}>
					<Icon path={mdiStop} size={1} />
				</button>
	)

	const LinkToApp = () => (
		<Link to={{pathname:ROUTES.WORKSHEET, filename: filename}} onClick={handleOpen} id={'link-app-'+ filename}>
			<div className='datasource-icon'>
				{runId === undefined || runId === ""
					? <Icon path={mdilTable} size={5}/>
					: <Icon path={mdiLoading} size={5} spin/>
				}
			</div>
		</Link>
	)

	return (
		<div className='datasource-thumbnail'>
			<ContextMenuTrigger className='datasource-dropdown' id={'right-click' + filename}>
				<LinkToApp />
				<div className='datasource-buttons-wrapper'>
					<Run />
					<OptionWithDropdown
						text={<Icon path={mdiDotsHorizontal} size={0.9} />}
						items={DATASOURCE_DROPDOWN}
						onSelect={handleDropdown}
						color={OFF_COLOR[color[authUser.uid]]}
						style={{ left: "13px" }}
					/>
				</div>
				<EditableInput
					value={name}
					readOnly={readOnly}
					onCommit={handleRename}
					files={filesWithTrash}
					classname='datasource-editabletext'
					setReadOnly={setReadOnly}
					inputId={'datasource-editabletext-'+filename}
				/>
			</ContextMenuTrigger>
			<ContextMenuDropdown filename={filename} onDropdown={handleDropdown} />
    </div>
	)
}

const Option = ({ text, hover, onHover, isOpen, onOpen, color }) => (
	<div
		className='datasource-options'
		onClick={onOpen}
		onMouseEnter={onHover}
		onMouseLeave={onHover}
		style={{ backgroundColor: hover && color }}
	>{text}</div>
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
)(DataSource)
