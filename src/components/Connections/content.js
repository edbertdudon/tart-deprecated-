import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import LoadingDataSource from '../Datasource/loadingdatasource'
import DataConnection from './dataconnection'
import { withFirebase } from '../Firebase'

const Content = ({ firebase, authUser }) => {
  const [loading, setLoading] = useState(false)
	const [connections, setConnections] = useState([])

	useEffect(() => {
		setLoading(true)
		firebase.connection(authUser.uid).get()
			.then(docC => {
				if (docC.exists) {
					let allConnections = Object.keys(docC.data())
					firebase.trash(authUser.uid).get().then(docT => {
						if (docT.exists) {
							let list = Object.keys(docT.data())
							let connectionsLessTrash = allConnections.filter(connection => {
								if (!list.includes(connection)) {
									return connection
								}
							})
							setConnections(connectionsLessTrash)
						}
					})
				}
        setLoading(false)
			})
	}, [])

	const handleReloadAfterDelete = (filename) => {
		let newConnection
		for (let i=0; i<connections.length; i++) {
			if (connections[i] === filename) {
				newConnection = [
					...connections.slice(0,i),
					...connections.slice(i+1)
				]
				break
			}
		}
		setConnections(newConnection)
	}

  return (
  	<div className='home-content'>
      {connections.length < 1
        ?	<div className='home-content-search'>
            Your uploaded files will appear here
          </div>
        :	<div>
            {connections.map(host =>
              <DataConnection
                filename={host}
                key={host}
                onReload={handleReloadAfterDelete}
              />
            )}
          </div>
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
