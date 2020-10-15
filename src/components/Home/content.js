//
//  HomeContent.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Notes:
//  - Jobs must persist to stay as loading -- use redux-persist
//  - Jobs is fetched every 3 minutes if there are jobs -- isJobsActive to track
//  - listJobs waits for cluster to be active, use job_filler as replacement in case cluster is not yet active
//
//  Known Issues:
//  - how to keep files in redux for app instance even after refresh
//  - useRecursiveTimeout is inefficient. Listing Files even if theres no change
//  - clicking RUN repetitively sometimes set loading indicator off -- runId gets rerendered a second time.
//

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import DataSource from '../Datasource/datasource'
import LoadingDataSource from '../Datasource/loadingdatasource'
import NewDataSource from '../Datasource/newdatasource'
import useRecursiveTimeout from './useRecursiveTimeout.ts'
import { shouldReloadTimer, getJobId, cancelJob, checkJobChanges } from './jobs'

import { withFirebase } from '../Firebase'

const Content = ({ firebase, authUser, files, jobs, onSetFiles, onSetJobs, isJobsActive, onSetIsJobsActive }) => {
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		firebase.doListFiles(authUser.uid).then(res => {
			let allFiles = res.items
			firebase.trash(authUser.uid).get().then(doc => {
				if (doc.exists) {
					let list = Object.keys(doc.data())
					let filesLessTrash = allFiles.filter(file => {
						if (!list.includes(file.name)) {
							return file.name
						}
					})
					onSetFiles(filesLessTrash, authUser.uid)
					setLoading(false)
				}
			})
		})
		firebase.doListJobs(authUser.uid)
			.then(res => {
				if (!("error" in res)) {
					onSetJobs(res)
				}
			})
			.then(() => onSetIsJobsActive(shouldReloadTimer(jobs)))
	}, [])

	// Checks every ** 1 minutes *** for finished jobs
	useRecursiveTimeout(() => {
		if (isJobsActive === false) return
		// Wait for promise to complete before scheduling the next iteration (synchronous)
		firebase.doListJobs(authUser.uid)
			.then(res => {
				if (checkJobChanges(res)) {
					firebase.doListFiles(authUser.uid).then(res => {
						onSetFiles(res.items, authUser.uid)
					})
				}
				return res
			})
			.then(res => onSetJobs(res))
			.then(() => onSetIsJobsActive(shouldReloadTimer(jobs)))
	}, 60000)

	const handleUpdateAfterTrash = filename => {
		onSetFiles(
			updateFilesAfterTrash(filename, files[authUser.uid]),
			authUser.uid
		)
	}

	const handleJobSubmit = filename => {
		onSetIsJobsActive(true)
		onSetJobs(submitJob(filename, jobs))
	}

	const handleJobCancel = runId => onSetJobs(cancelJob(runId, jobs))

	const Files = () => {
		if (files[authUser.uid] === undefined) return null
		return (
			<>
				{files[authUser.uid].map(file => (
					(/[.]/.exec(file.name) === null) &&
						<DataSource
							filename={file.name}
							onReload={handleUpdateAfterTrash}
							runId={getJobId(file.name.replace(/\s/g, '').toLowerCase(), jobs)}
							onJobSubmit={handleJobSubmit}
							onJobCancel={handleJobCancel}
							key={file.name}
						/>
				))}
			</>
		)
	}

	return (
		<div className='home-content'>
			{loading && <LoadingDataSource />}
			<Files />
			<NewDataSource />
		</div>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	files: (state.filesState.files || {}),
	jobs: (state.jobsState.jobs || [{status:'failed list jobs'}]),
	isJobsActive: (state.isJobsActiveState.isJobsActive || false),
})

const mapDispatchToProps = dispatch => ({
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
	onSetJobs: (jobs) => dispatch({type: 'JOBS_SET', jobs}),
	onSetIsJobsActive: (isJobsActive) => dispatch({type: 'ISJOBSACTIVE_SET', isJobsActive}),
})

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withFirebase,
)(Content)
