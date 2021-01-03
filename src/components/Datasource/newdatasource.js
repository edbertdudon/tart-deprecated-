import React, { useState } from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { getMaxNumberCustomSheet } from '../../functions'
import Icon from '@mdi/react';
import { mdilPlus } from '@mdi/light-js'
import { mdiLoading } from '@mdi/js'

import { withFirebase } from '../Firebase'
import * as ROUTES from '../../constants/routes'
import { DEFAULT_INITIAL_SLIDES } from '../../constants/default'

const NewDataSource = ({ firebase, authUser, files, onSetWorksheetname }) => {
	const [isLoading, setIsLoading] = useState(false)
	let history = useHistory()

	const handleOpen = () => {
		setIsLoading(true)
		let filename = "Untitled Worksheet "
			+ getMaxNumberCustomSheet(
				files[authUser.uid].map(file => file.name),
				"Untitled Worksheet "
			)
		firebase.doUploadFile(
			authUser.uid,
			filename,
			new File (
				[JSON.stringify(DEFAULT_INITIAL_SLIDES)],
				filename,
				{type: "application/json"}
			)
		).on('state_changed', function(){}, function(){}, snapshot => {
			onSetWorksheetname(filename, authUser.uid)
			history.push(ROUTES.WORKSHEET)
		})
	}

  return (
		<div className='datasource-thumbnail'>
			<div className='newdatasource-button' onClick={handleOpen}>
				<div className='datasource-icon'>
					{isLoading
						? <Icon path={mdiLoading} size={5} spin/>
						: <Icon path={mdilPlus} size={5}/>
					}
				</div>
			</div>
			{/*<div className='datasource-text'>Add worksheet</div>*/}
		</div>
  )
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	files: (state.filesState.files || {}),
	worksheetname: (state.worksheetnameState.worksheetname || ''),
})

const mapDispatchToProps = dispatch => ({
	onSetWorksheetname: worksheetname => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
)(NewDataSource)
