import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import DataSourceJobs from './datasourcejobs'
import useRecursiveTimeout from '../Home/useRecursiveTimeout.ts'
import { shouldReloadTimer, getJobId, cancelJob, checkJobChanges, submitJob } from '../Home/jobs'
import { withFirebase } from '../Firebase'

const withJobsContentNull = Component => props =>
	props.jobs[0].status === "failed list jobs"
		?	<div className='home-content-search'>No Jobs Running</div>
		:	<Component {...props} />

const JobsContentRunning = ({ files, jobs, onSetJobs, firebase, authUser, isJobsActive, onSetIsJobsActive, onSetFiles }) => {
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
				}
			})
		})
		setLoading(false)
		firebase.doListJobs(authUser.uid)
			.then(res => onSetJobs(res))
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

	const handleJobSubmit = filename => {
		onSetIsJobsActive(true)
		onSetJobs(submitJob(filename, jobs))
	}

	const handleJobCancel = runId => onSetJobs(cancelJob(runId, jobs))

	return (
		<div>
			{files[authUser.uid] !== undefined && files[authUser.uid]
				.filter(file => {
					let fileLabel = file.name.replace(/\s/g, '').toLowerCase()
					if (jobs[0].status !== "failed list jobs") {
						let jobsList = jobs.map(job => {return job.labels.worksheet})
						if (jobsList.includes(fileLabel)) {
							return file
						}
					}
				}).map((job, index) => (
					(/[.]/.exec(job.name) === null) &&
						<DataSourceJobs
							filename={job.name}
							runId={getJobId(job.name.replace(/\s/g, '').toLowerCase(), jobs)}
							onJobSubmit={handleJobSubmit}
							onJobCancel={handleJobCancel}
						/>
				))
			}
		</div>
	)
}

const withConditiionalRenderings = compose(
	withJobsContentNull,
)

const JobsContentWithConditionalRendering = withConditiionalRenderings(JobsContentRunning)

const JobsContent = ({ firebase, authUser, jobs, files, onSetJobs, isJobsActive, onSetIsJobsActive, onSetFiles }) => {
	return (
		<div className='home-content'>
			<JobsContentWithConditionalRendering
				firebase={firebase}
				authUser={authUser}
				jobs={jobs}
				files={files}
				onSetJobs={onSetJobs}
				isJobsActive={isJobsActive}
				onSetIsJobsActive={onSetIsJobsActive}
				onSetFiles={onSetFiles}
			/>
		</div>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	jobs: (state.jobsState.jobs || [{status:'failed list jobs'}]),
	isJobsActive: (state.isJobsActiveState.isJobsActive || false),
	files: (state.filesState.files || {}),
});

const mapDispatchToProps = dispatch => ({
	onSetJobs: (jobs) => dispatch({type: 'JOBS_SET', jobs}),
	onSetIsJobsActive: (isJobsActive) => dispatch({type: 'ISJOBSACTIVE_SET', isJobsActive}),
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(JobsContent)
