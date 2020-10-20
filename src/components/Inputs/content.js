import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import LoadingDataSource from '../Datasource/loadingdatasource'
import DataInput from './datainput'
import { withFirebase } from '../Firebase'

const Content = ({ firebase, authUser, files, onSetFiles }) => {
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
        setLoading(false)
			})
	  })
	}, [])

  const handleUpdateAfterTrash = filename => {
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

  return (
		<div className='home-content'>
      {authUser.uid in files && (files[authUser.uid].filter(file => /[.]/.exec(file.name) != null).length < 1
				?	<div className='home-content-search'>
						Your database connections will appear here
					</div>
				:	<div>
            {files[authUser.uid]
              .filter(file => /[.]/.exec(file.name) != null)
              .map((file, index) =>
                <DataInput filename={file.name} onReload={handleUpdateAfterTrash} key={index} />
            )}
					</div>
			)}
		</div>
  )
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	files: (state.filesState.files || {}),
});

const mapDispatchToProps = dispatch => ({
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
})

export default compose(
	withFirebase,
	connect(
	  mapStateToProps,
    mapDispatchToProps
	),
)(Content)
