import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import DataSourceSearch from './datasourcesearch'
import SearchSource from './searchsource'
import useRecursiveTimeout from '../Home/useRecursiveTimeout.ts'
import { shouldReloadTimer, getJobId, cancelJob, checkJobChanges } from '../Home/jobs'
import { withFirebase } from '../Firebase'

const withSearchContentNull = Component => props => (
	Object.keys(props.search).length === 0
		?	<div className='home-content-search'>Search your library</div>
		:	<Component {...props} />
)

const withSearchContentNoResult = Component => props =>
	Object.keys(props.search).length === 0 || props.search.filter.length < 1
		?	<div className='home-content-search'>{'No results found for "' + props.search.input + '"'}</div>
		:	<Component {...props} />

const SearchContentFiltered = ({ search, jobs, onSetJobs, firebase, authUser, isJobsActive, onSetIsJobsActive, onSetFiles, onSetSearch }) => {
	const [connections, setConnections] = useState([])
	console.log(firebase)
	useEffect(() => {
		firebase.connection(authUser.uid).get()
			.then(doc => {
				if (doc.exists) setConnections(Object.keys(doc.data()))
			})
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
						updateSearch(res.items)
					})
				}
				return res
			})
			.then(res => onSetJobs(res))
			.then(() => shouldReloadTimer())

	}, 60000)

	const handleJobSubmit = filename => {
		onSetIsJobsActive(true)
		onSetJobs(submitJob(filename, jobs))
	}

	const handleJobCancel = runId => onSetJobs(cancelJob(runId, jobs))

	// *** Background Functions ***

	const updateSearch = (newFiles) => {
		let input = search.input
		let library = [...newFiles, ...connections]
		let filter = library.filter(file =>
			file.toLowerCase().includes(input.toLowerCase()))
		if (input.length > 0) {
			if (filter.length > 0) {
				onSetSearch({input: input, filter: filter})
			} else {
				onSetSearch({input: input, filter: []})
			}
		} else {
			onSetSearch({})
		}
	}

	return (
		<div>
			{
				search.filter.map((file, index) => ((/[.]/.exec(file) === null)
					?	<DataSourceSearch
							filename={file}
							connections={connections}
							runId={getJobId(file.replace(/\s/g, '').toLowerCase(), jobs)}
							onJobSubmit={handleJobSubmit}
							onJobCancel={handleJobCancel}
							key={index}
						/>
					:	<SearchSource filename={file} key={index} /> ))
			}
		</div>
	)
}

const withConditiionalRenderings = compose(
	withSearchContentNull,
	withSearchContentNoResult
)

const SearchContentWithConditionalRendering = withConditiionalRenderings(SearchContentFiltered)

const SearchContent = ({ search, firebase, authUser, jobs, onSetJobs, isJobsActive, onSetIsJobsActive, onSetFiles, onSetSearch }) => (
	<div className='home-content'>
		<SearchContentWithConditionalRendering
				search={search}
				firebase={firebase}
				authUser={authUser}
				jobs={jobs}
				onSetJobs={onSetJobs}
				isJobsActive={isJobsActive}
				onSetIsJobsActive={onSetIsJobsActive}
				onSetFiles={onSetFiles}
				onSetSearch={onSetSearch}
			/>
	</div>
)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	search: (state.searchState.search || {}),
	jobs: (state.jobsState.jobs || [{status:'failed list jobs'}]),
	isJobsActive: (state.isJobsActiveState.isJobsActive || false),
	files: (state.filesState.files || {}),
});

const mapDispatchToProps = dispatch => ({
	onSetJobs: (jobs) => dispatch({type: 'JOBS_SET', jobs}),
	onSetIsJobsActive: (isJobsActive) => dispatch({type: 'ISJOBSACTIVE_SET', isJobsActive}),
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
	onSetSearch: (search) => dispatch({type: 'SEARCH_SET', search}),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(SearchContent)
