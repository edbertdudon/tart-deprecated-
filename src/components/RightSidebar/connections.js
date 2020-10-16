import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js'

import { withFirebase } from '../Firebase'

const Connections = ({ firebase, authUser, color }) => {
  const [connections, setConnections] = useState({})
  const [loading, setLoading] = useState(false)
  const [host, setHost] = useState('')
  const [tables, setTables] = useState([])
  const [currentRightSidebar, setCurrentRightSidebar] = useState(false)

  useEffect(() => {
    firebase.connection(authUser.uid).get()
      .then(doc => {
        if (doc.exists) setConnections((doc.data()))
      })
  }, [])

  const handleSelectDatabase = host => {
    setLoading(true)
    setCurrentRightSidebar(true)
    setHost(host)
    firebase.doListTablesMySql({
  		url: connections[host].url,
  		user: connections[host].user,
  		password: connections[host].password,
  		database: new URL(connections[host].url).pathname.substr(1),
  	}).then(res => {
      if (res.status === 'CONNECTED') setTables(res)
      setLoading(false)
    })
  }

  const handleSelectTable = table => {
    setLoading(true)
    const login = {
      url: connections[host].url,
      user: connections[host].user,
      password: connections[host].password,
      dbtable: table.TABLE_NAME
    }
    firebase.doGetTableSampleFromMySql(
      connections[host].url,
      connections[host].user,
      connections[host].password,
      new URL(connections[host].url).pathname.substr(1),
      table.TABLE_NAME
    ).then(res => {
      if (res.status === 'CONNECTED') {
      // dispatchSlides({
      // 	function: 'INPUT',
      // 	data: addDataEditorReadOnly(mySqlToSpreadsheet(res), DataViewer),
      // 	currentSlide: currentSlide,
      // 	type: "input",
      // 	fileName: table.TABLE_NAME,
      // 	delimiter: "mySQL",
      // 	login: login
      // })
      // setCurrentSlide(currentSlide+1)
      }
      setLoading(false)
    })
  }

  const handleBack = () => {
    setCurrentRightSidebar(false)
    setLoading(false)
  }

  const Tables = () => (
    <>
  		<div className='rightsidebar-heading'>
        Tables
        <div className='rightsidebar-back' style={{color: color[authUser.uid]}} onClick={handleBack}>Back</div>
      </div>
  		{loading && <div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin /></div>}
  		{tables.map((table, index) => (
  			<div className='rightsidebar-item' onClick={() => handleSelectTable(table)} key={index}>
  				{table.TABLE_NAME}
  			</div>
  		))}
  	</>
  )

  const Connection = () => (
    <>
      <div className='rightsidebar-heading'>Connections</div>
      {loading && <div className='rightsidebar-loading'><Icon path={mdiLoading} size={1.5} spin /></div>}
      {connections !== undefined && Object.keys(connections).map((host, index) => (
        <div className='rightsidebar-item' onClick={() => handleSelectDatabase(host)} key={index}>
          {host}
        </div>
      ))}
    </>
  )

  return (
    <>{currentRightSidebar ? <Tables /> : <Connection />}</>
  )
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
});

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
	),
)(Connections)
