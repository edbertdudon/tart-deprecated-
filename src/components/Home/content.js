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

import { withFirebase } from '../Firebase'

const terminalStates = new Set(['DONE', 'ERROR', 'CANCELLED']);
const queueStates = new Set(['PENDING', 'SETUP_DONE', 'RUNNING'])

const Content = ({ firebase, authUser, files, jobs, onSetFiles, onSetJobs, isJobsActive, onSetIsJobsActive}) => {
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
					console.log(res)
					onSetJobs(res)
				}
			})
			.then(() => shouldReloadTimer())
	}, [])

	// Checks every ** 1 minutes *** for finished jobs
	useRecursiveTimeout(() => {
		if (isJobsActive === false) return
		// Wait for promise to complete before scheduling the next iteration (synchronous)
		firebase.doListJobs(authUser.uid)
			.then(res => {
				// Checks for changes in job before downloading new files created
				let isChanged = false
				for (var i=0; i<res.length; i++ ) {
					if (terminalStates.has(res[i].status.state)) isChanged = true
				}
				if (isChanged) {
					firebase.doListFiles(authUser.uid).then(res => {
						onSetFiles(res.items, authUser.uid)
					})
				}
				return res
			})
			.then(res => onSetJobs(res))
			.then(() => shouldReloadTimer())
	}, 60000)

	const handleUpdateAfterTrash = (filename) => {
		let newFile
		for (var i=0; i<files[authUser.uid].length; i++) {
			if (files[authUser.uid][i].name === filename) {
				newFile = [
					...files[authUser.uid].slice(0,i),
					...files[authUser.uid].slice(i+1)
				]
				break
			}
		}
		onSetFiles(newFile, authUser.uid)
	}

	// Set Temporary Job and then useRecursiveTimeout runs listJobs -- waits for cluster to be active in server
	const handleJobSubmit = (filename) => {
		onSetIsJobsActive(true)
		const worksheet = filename.replace(/\s/g, '').toLowerCase()
		let fillerJobs = []
		if (jobs[0].status !== 'failed list jobs') {
			for (var i=0; i<jobs.length; i++) {
				if (jobs[i].reference.jobId.startsWith('filler job')) fillerJobs.push(jobs[i])
			}
		}
		const countFillers = fillerJobs.length
		const job_filler = {
			status: {state:"PENDING"},
			labels: {worksheet: worksheet},
			reference: {jobId: "filler job " + (countFillers+1)}
		}
		let newJobs
		if (jobs[0].status === 'failed list jobs') {
			newJobs = [job_filler]
		} else {
			newJobs = [
				...jobs,
				job_filler
			]
		}
		onSetJobs(newJobs)
	}

	// Deletes temporary Job and then list Jobs then useRecursiveTimeout will be called once more (unless theres different jobs running)
	const handleJobCancel = (runId) => {
		let currentJob
		for (var i=0; i<jobs.length; i++) {
			if (jobs[i].reference.jobId === runId ) {
				currentJob = i
			}
		}
		let newJobs = [
			...jobs.slice(0, currentJob),
			...jobs.slice(currentJob+1)
		]
		if (newJobs.length < 1) newJobs = [{status:'failed list jobs'}]
		onSetJobs(newJobs)
	}

	// *** Background Functions ***
	const shouldReloadTimer = () => {
		if (jobs[0].status === "failed list jobs") {
			onSetIsJobsActive(false)
		} else {
			let shouldReload = false
			for (var i=0; i<jobs.length; i++) {
				if (!terminalStates.has(jobs[i].status.state)) {
					shouldReload = true
				}
			}
			onSetIsJobsActive(shouldReload)
		}
	}

	const getJobId = (filename) => {
		if (jobs[0].status !== "failed list jobs") {
			for (var i=0; i<jobs.length; i++) {
				if (filename === jobs[i].labels.worksheet) {
					if (queueStates.has(jobs[i].status.state)) {
						return jobs[i].reference.jobId
					}
				}
			}
		}
	}

	const Files = () => {
		if (files[authUser.uid] === undefined) return null
		return (
			<>
				{files[authUser.uid].map(file => (
					(/[.]/.exec(file.name) === null) &&
						<DataSource
							filename={file.name}
							onReload={handleUpdateAfterTrash}
							runId={getJobId(file.name.replace(/\s/g, '').toLowerCase())}
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
