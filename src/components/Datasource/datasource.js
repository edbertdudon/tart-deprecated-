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

import { xtos } from '../../functions'
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

const ContextMenuDropdown = ({ filename, onDropdown }) => (
	<ContextMenu id={'right-click' + filename}>
		<MenuItem onClick={() =>onDropdown(DATASOURCE_DROPDOWN[0].key)} onContextMenu={(e) => e.preventPropognation()}>
			{DATASOURCE_DROPDOWN[0].key}
		</MenuItem>
		<MenuItem onClick={() => onDropdown(DATASOURCE_DROPDOWN[1].key)}>{DATASOURCE_DROPDOWN[1].key}</MenuItem>
		<MenuItem onClick={() => onDropdown(DATASOURCE_DROPDOWN[2].key)}>{DATASOURCE_DROPDOWN[2].key}</MenuItem>
		<MenuItem onClick={() => onDropdown(DATASOURCE_DROPDOWN[3].key)}>{DATASOURCE_DROPDOWN[2].key}</MenuItem>
		<MenuItem onClick={() => onDropdown(DATASOURCE_DROPDOWN[4].key)}>{DATASOURCE_DROPDOWN[2].key}</MenuItem>
	</ContextMenu>
)

const DataSource = ({ firebase, authUser, color, files, jobs, slides, onSetWorksheetname, onSetJobs,
	onJobSubmit, onJobCancel, onReload, filename, index, runId }) => {
	const [hover, setHover] = useState(false)
	const [hoverDropdown, setHoverDropdown] = useState(false)

	const handleDropdown = key => {
		switch(key) {
			case DATASOURCE_DROPDOWN[0].key:
				onSetWorksheetname(filename, authUser.uid)
				document.getElementById(`link-app-${filename}`).click()
				break;
			case DATASOURCE_DROPDOWN[1].key:
				let worksheet = filename
				if (worksheet.includes(' copy')) {
					worksheet = worksheet.substring(0, worksheet.indexOf(' copy'))
				}
				// Can we persist files deeper than one level instead?
				firebase.doListFiles(authUser.uid).then(res => {
					firebase.doDownloadFile(authUser.uid, filename).then(slides => {
						const file = new File (
							[JSON.stringify(slides.getData())],
							worksheet + ' copy ' + getMaxNumberFile(res.items, worksheet),
							{type: "application/json"}
						)
						var uploadTask = firebase.doUploadFile(authUser.uid, filename, file)
						uploadTask.on('state_changed', function(){}, function(){}, snapshot => {
							// Reload home files
						})
					})
				})
				break;
			case DATASOURCE_DROPDOWN[2].key:
				document.getElementById('datasource-editabletext-' + filename).readOnly = false
				document.getElementById('datasource-editabletext-' + filename).focus()
				break;
			case DATASOURCE_DROPDOWN[3].key:
				firebase.doDownloadFile(authUser.uid, filename)
					.then(slides => {
						xtos(slides, filename)
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

	const handleHeader = name => {
		// firebase.doDownloadFile(authUser.uid, filename)
		// 	.then(slides => {
		// 		firebase.doUploadFile(
		// 			authUser.uid,
		// 			name,
		// 			new File ([JSON.stringify(slides)], name, {type: "application/json"})
		// 		)
		// 		firebase.doDeleteFile(authUser.uid, filename)
		// 		onSetWorksheetname(name, authUser.uid)
		// 	})

		// Name reverts back but is already changed in firebase
	}

	const handleOpen = () => onSetWorksheetname(filename, authUser.uid)

	const Run = () => (
		(runId === undefined || runId === "")
			?	<button
					className='datasource-button'
					onClick={handleRun}
					style={{backgroundColor: hover && color[authUser.uid]}}
					onMouseEnter={() => setHover(!hover)} onMouseLeave={() => setHover(!hover)}
				>RUN</button>
			:	<button className='datasource-button' onClick={handleCancel} style={{backgroundColor:color[authUser.uid]}}>
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
						classname='datasource-options'
						color={OFF_COLOR[color[authUser.uid]]}
						style={{ left: "13px" }}
					/>
				</div>
				<EditableInput
					value={filename.replace(/\.[^/.]+$/, "")}
					onCommit={handleHeader}
					files={files[authUser.uid]}
					classname='datasource-editabletext'
				/>
			</ContextMenuTrigger>
			<ContextMenuDropdown filename={filename} onDropdown={handleDropdown} />
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
	slides: (state.slidesState.slides || {}),
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
