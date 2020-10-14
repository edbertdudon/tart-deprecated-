// import React, { useState, useEffect } from 'react'
// import { connect } from 'react-redux'
// import { compose } from 'recompose'
// import SearchDataSource from './SearchDataSource'
// import SearchSource from './SearchSource'
// import useRecursiveTimeout from '../Home/useRecursiveTimeout'
//
// import { withFirebase } from '../Firebase'
//
// const terminalStates = new Set(['DONE', 'ERROR', 'CANCELLED']);
// const queueStates = new Set(['PENDING', 'SETUP_DONE', 'RUNNING'])
//
// const withSearchContentNull = Component => props =>
// 	Object.keys(props.search).length === 0
// 		?	<div className='home-content-search'>
// 				<p>Search your library</p>
// 			</div>
// 		:	<Component {...props} />
//
// const withSearchContentNoResult = Component => props =>
// 	Object.keys(props.search).length === 0 || props.search.filter.length < 1
// 		?	<div className='home-content-search'>
// 				<p>{'No results found for "' + props.search.input + '"'}</p>
// 			</div>
// 		:	<Component {...props} />
//
// const SearchContentFiltered = ({ search, jobs, onSetJobs, firebase, authUser,
// 	isJobsActive, onSetIsJobsActive, onSetFiles, onSetSearch }) => {
// 	const [connections, setConnections] = useState([])
//
// 	useEffect(() => {
// 		firebase.connection(authUser.uid).get()
// 			.then(doc => {
// 				if (doc.exists) setConnections(Object.keys(doc.data()))
// 			})
//
// 		firebase.doListJobs(authUser.uid)
// 			.then(res => onSetJobs(res))
// 			.then(() => shouldReloadTimer())
// 	}, [])
//
// 	// Checks every ** 1 minutes *** for finished jobs
// 	useRecursiveTimeout(() => {
// 		if (isJobsActive === false) return
//
// 		// Wait for promise to complete before scheduling the next iteration (synchronous)
// 		firebase.doListJobs(authUser.uid)
// 			.then(res => {
// 				// Checks for changes in job before downloading new files created
// 				let isChanged = false
// 				for (var i=0; i<res.length; i++ ) {
// 					if (terminalStates.has(res[i].status.state)) isChanged = true
// 				}
//
// 				if (isChanged) {
// 					firebase.doListFiles(authUser.uid).then(res => {
// 						onSetFiles(res.items, authUser.uid)
// 						updateSearch(res.items)
// 					})
// 				}
// 				return res
// 			})
// 			.then(res => onSetJobs(res))
// 			.then(() => shouldReloadTimer())
//
// 	}, 60000)
//
// 	// Set Temporary Job and then useRecursiveTimeout runs listJobs -- waits for cluster to be active in server
// 	const handleJobSubmit = (filename) => {
// 		onSetIsJobsActive(true)
//
// 		const worksheet = filename.replace(/\s/g, '').toLowerCase()
// 		let fillerJobs = []
// 		if (jobs[0].status !== 'failed list jobs') {
// 			for (var i=0; i<jobs.length; i++) {
// 				if (jobs[i].reference.jobId.startsWith('filler job')) fillerJobs.push(jobs[i])
// 			}
// 		}
// 		const countFillers = fillerJobs.length
// 		const job_filler = {
// 			status: {state:"PENDING"},
// 			labels: {worksheet: worksheet},
// 			reference: {jobId: "filler job " + (countFillers+1)}
// 		}
// 		let newJobs
// 		if (jobs[0].status === 'failed list jobs') {
// 			newJobs = [job_filler]
// 		} else {
// 			newJobs = [
// 				...jobs,
// 				job_filler
// 			]
// 		}
// 		onSetJobs(newJobs)
// 	}
//
// 	// Deletes temporary Job and then list Jobs then useRecursiveTimeout will be called once more (unless theres different jobs running)
// 	const handleJobCancel = (runId) => {
// 		let currentJob
// 		for (var i=0; i<jobs.length; i++) {
// 			if (jobs[i].reference.jobId === runId ) {
// 				currentJob = i
// 			}
// 		}
//
// 		let newJobs = [
// 			...jobs.slice(0, currentJob),
// 			...jobs.slice(currentJob+1)
// 		]
// 		if (newJobs.length < 1) newJobs = [{status:'failed list jobs'}]
// 		onSetJobs(newJobs)
// 	}
//
// 	// *** Background Functions ***
//
// 	const updateSearch = (newFiles) => {
// 		let input = search.input
// 		let library = [...newFiles, ...connections]
// 		let filter = library.filter(file =>
// 			file.toLowerCase().includes(input.toLowerCase()))
// 		if (input.length > 0) {
// 			if (filter.length > 0) {
// 				onSetSearch({input: input, filter: filter})
// 			} else {
// 				onSetSearch({input: input, filter: []})
// 			}
// 		} else {
// 			onSetSearch({})
// 		}
// 	}
//
// 	const shouldReloadTimer = () => {
// 		if (jobs[0].status === "failed list jobs") {
// 			onSetIsJobsActive(false)
// 		} else {
// 			let shouldReload = false
// 			for (var i=0; i<jobs.length; i++) {
// 				if (!terminalStates.has(jobs[i].status.state)) {
// 					shouldReload = true
// 				}
// 			}
// 			onSetIsJobsActive(shouldReload)
// 		}
// 	}
//
// 	const getJobId = (filename) => {
// 		if (jobs[0].status !== "failed list jobs") {
// 			for (var i=0; i<jobs.length; i++) {
// 				if (filename === jobs[i].labels.worksheet) {
// 					if (queueStates.has(jobs[i].status.state)) {
// 						return jobs[i].reference.jobId
// 					}
// 				}
// 			}
// 		}
// 	}
//
// 	return (
// 		<div>
// 			{search.filter.map((file, index) => ((/[.]/.exec(file) === null)
// 				?	<SearchDataSource
// 						filename={file}
// 						connections={connections}
// 						runId={getJobId(file.replace(/\s/g, '').toLowerCase())}
// 						onJobSubmit={handleJobSubmit}
// 						onJobCancel={handleJobCancel}
// 					/>
// 				:	<SearchSource filename={file} key={index} /> ))}
// 		</div>
// 	)
// }
//
// const withConditiionalRenderings = compose(
// 	withSearchContentNull,
// 	withSearchContentNoResult
// )
//
// const SearchContentWithConditionalRendering = withConditiionalRenderings(SearchContentFiltered)
//
// const SearchContent = ({ search, firebase, authUser, jobs, onSetJobs, isJobsActive, onSetIsJobsActive, onSetFiles, onSetSearch }) => {
// 	return (
// 		<div className='home-content'>
// 			<SearchContentWithConditionalRendering
// 				search={search}
// 				firebase={firebase}
// 				authUser={authUser}
// 				jobs={jobs}
// 				onSetJobs={onSetJobs}
// 				isJobsActive={isJobsActive}
// 				onSetIsJobsActive={onSetIsJobsActive}
// 				onSetFiles={onSetFiles}
// 				onSetSearch={onSetSearch}
// 			/>
// 		</div>
// 	)
// }
//
// const mapStateToProps = state => ({
// 	authUser: state.sessionState.authUser,
// 	search: (state.searchState.search || {}),
// 	jobs: (state.jobsState.jobs || [{status:'failed list jobs'}]),
// 	isJobsActive: (state.isJobsActiveState.isJobsActive || false),
// 	files: (state.filesState.files || {}),
// });
//
// const mapDispatchToProps = dispatch => ({
// 	onSetJobs: (jobs) => dispatch({type: 'JOBS_SET', jobs}),
// 	onSetIsJobsActive: (isJobsActive) => dispatch({type: 'ISJOBSACTIVE_SET', isJobsActive}),
// 	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
// 	onSetSearch: (search) => dispatch({type: 'SEARCH_SET', search}),
// })
//
// export default compose(
// 	withFirebase,
// 	connect(
// 		mapStateToProps,
// 		mapDispatchToProps,
// 	),
// )(SearchContent)
