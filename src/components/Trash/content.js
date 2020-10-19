import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import LoadingDataSource from '../Datasource/loadingdatasource'
import DataTrash from './datatrash'
import { withFirebase } from '../Firebase'

const Content = ({ firebase, authUser }) => {
  const [loading, setLoading] = useState(false)
	const [connections, setConnections] = useState([])
	const [trash, setTrash] = useState([])

	useEffect(() => {
		setLoading(true)
		firebase.trash(authUser.uid).get().then(doc => {
			if (doc.exists) {
				let list = Object.keys(doc.data())
				setTrash(list)
				setLoading(false)
			}
		})
		firebase.connection(authUser.uid).get()
			.then(doc => {
				if (doc.exists) {
					let list = Object.keys(doc.data())
					setConnections(list)
				}
			})
}, [])

  const handleUpdateAfterDelete = filename => {
    let newFile
      for (var i=0; i<trash.length; i++) {
        if (trash[i] === filename) {
          newFile = [
            ...trash.slice(0,i),
            ...trash.slice(i+1)
          ]
          break
        }
      }
    setTrash(newFile)
  }

  return (
  	<div className='home-content'>
      {loading
        ? <LoadingDataSource />
        : <>
            {connections.length < 1
              ?	<div className='home-content-search'>Trash is empty</div>
              :	<div>
                  {trash.map((file, index) =>
                    <DataTrash filename={file} onReload={handleUpdateAfterDelete} key={index} connections={connections} />
                  )}
                </div>
            }
          </>
      }
  	</div>
  )
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(Content)
