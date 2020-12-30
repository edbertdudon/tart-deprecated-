//
//  HomeContent.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Notes:
//  - Jobs must persist to stay as loading -- use redux-persist
//  - Jobs is fetched every minute if there are jobs -- isJobsActive to track
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

export const shouldReloadTimer = (jobs) => {
  if (jobs[0].status === "failed list jobs") {
    return(false)
  } else {
    let shouldReload = false
    for (var i=0; i<jobs.length; i++) {
      if (!terminalStates.has(jobs[i].status.state)) {
        shouldReload = true
      }
    }
    return(shouldReload)
  }
}

export const getJobId = (filename, jobs) => {
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

// Checks for changes in job before downloading new files created
export const checkJobChanges = (res) => {
  let isChanged = false
  for (var i=0; i<res.length; i++ ) {
    if (terminalStates.has(res[i].status.state)) {
      isChanged = true
    }
  }
  return isChanged
}

// Set Temporary Job and then useRecursiveTimeout runs listJobs -- waits for cluster to be active in server
export const submitJob = (filename, jobs) => {
  let fillerJobs = []
  if (jobs[0].status !== 'failed list jobs') {
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i].reference.jobId.startsWith('filler job')) fillerJobs.push(jobs[i])
    }
  }
  const job_filler = {
    status: {state:"PENDING"},
    labels: {worksheet: filename.replace(/\s/g, '').toLowerCase()},
    reference: {jobId: "filler job " + (fillerJobs.length+1)}
  }
  if (jobs[0].status === 'failed list jobs') {
    return([job_filler])
  } else {
    return([...jobs, job_filler])
  }
}

// Deletes temporary Job and then list Jobs then useRecursiveTimeout will be called once more (unless theres different jobs running)
export const cancelJob = (runid, jobs) => {
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
  return newJobs
}

export const updateFilesAfterTrash = (filename, files) => {
  let newFile
  for (var i=0; i<files.length; i++) {
    if (files[i].name === filename) {
      newFile = [
        ...files.slice(0,i),
        ...files.slice(i+1)
      ]
      break
    }
  }
  return newFile
}

const Content = ({ firebase, authUser, files, jobs, notifications, onSetFiles, onSetJobs, isJobsActive, onSetIsJobsActive,
  onSetNotifications }) => {
	const [loading, setLoading] = useState(false)
  const [filesWithTrash, setFilesWithTrash] = useState([])

	useEffect(() => {
		setLoading(true)
		listFilesLessTrash()
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
					listFilesLessTrash()
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
		onSetNotifications(notifications.concat({key: 'Job started: ' + filename, type: 'notification'}))
	}

	const handleJobCancel = runId => {
		onSetJobs(cancelJob(runId, jobs))
		onSetNotifications(notifications.concat({key: 'Job cancelled: ' + filename, type: 'notification'}))
	}

	const listFilesLessTrash = () => {
		firebase.doListFiles(authUser.uid).then(res => {
			let allFiles = res.items
      setFilesWithTrash(allFiles)
			firebase.trash(authUser.uid).get().then(doc => {
				if (doc.exists) {
					let list = Object.keys(doc.data())
					let filesLessTrash = allFiles.filter(file => {
						if (!list.includes(file.name)) {
							return file.name
						}
					})
          setLoading(false)
					onSetFiles(filesLessTrash, authUser.uid)
				}
			})
		})
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
							runId={getJobId(file.name.replace(/\s/g, '').toLowerCase(), jobs)}
							onJobSubmit={handleJobSubmit}
							onJobCancel={handleJobCancel}
							key={file.name}
							onListFilesLessTrash={listFilesLessTrash}
              filesWithTrash={filesWithTrash}
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
  notifications: (state.notificationsState.notifications || []),
})

const mapDispatchToProps = dispatch => ({
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
	onSetJobs: (jobs) => dispatch({type: 'JOBS_SET', jobs}),
	onSetIsJobsActive: (isJobsActive) => dispatch({type: 'ISJOBSACTIVE_SET', isJobsActive}),
  onSetNotifications: (notifications) => dispatch({type: 'NOTIFICATIONS_SET', notifications}),
})

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	withFirebase,
)(Content)
