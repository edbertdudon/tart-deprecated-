import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Header from './header'
import ImportDatabase from '../Connectors/importdatabase'
import ImportDatabaseOracle from '../Connectors/importdatabaseoracle'
import { getMaxNumberFromFiles, xtos } from '../../functions'
import withDropdown from '../Dropdown'
import withModal from '../Modal'
import * as ROUTES from '../../constants/routes'
import { withFirebase } from '../Firebase'

export const FILE_DROPDOWN = [
  {key: 'New...', type: 'item'},
  {key: 'Save', type: 'item'},
  {key: 'Duplicate', type: 'item'},
  {key: 'Rename...', type: 'item'},
  {key: 'Download as Xlsx', type: 'item'},
  {key: 'Move to Trash', type: 'link', path: ROUTES.HOME},
  {type: 'divider'},
  {key: 'Connect to MySQL...', type: 'item'},
  {key: 'Connect to SQL server...', type: 'item'},
  {key: 'Connect to Oracle SQL...', type: 'item'},
]

const Files = ({ firebase, authUser, worksheetname, files, slides, color, onSetWorksheetname }) => {
  const [isOpenDatabaseMysql, setIsOpenDatabaseMysql] = useState(false)
  const [isOpenDatabaseSqlserver, setIsOpenDatabaseSqlserver] = useState(false)
  const [isOpenDatabaseOracle, setIsOpenDatabaseOracle] = useState(false)

  const handleFile = key => {
    switch (key) {
      case FILE_DROPDOWN[0].key:
        let filename = "Untitled Worksheet " + getMaxNumberFromFiles(files[authUser.uid])
        firebase.doUploadFile(
          authUser.uid,
          filename,
          new File ([JSON.stringify(DEFAULT_INITIAL_SLIDES)], filename, {type: "application/json"})
        ).on('state_changed', function(){}, function(){}, snapshot => {
          onSetWorksheetname(filename)
          window.location.reload()
        })
        break;
      case FILE_DROPDOWN[1].key:
        const file = new File ([JSON.stringify(slides.getData())], worksheetname, {type: "application/json"})
        firebase.doUploadFile(authUser.uid, worksheetname, file)
        break;
      case FILE_DROPDOWN[2].key:
        let worksheet = worksheetname
        if (worksheet.includes(' copy')) {
        	worksheet = worksheet.substring(0, worksheet.indexOf(' copy'))
        }
        // Can we persist files deeper than one level instead?
        firebase.doListFiles(authUser.uid).then(res => {
        	const file = new File (
        		[JSON.stringify(slides.getData())],
        		worksheet + ' copy ' + getMaxNumberFile(res.items, worksheet),
        		{type: "application/json"}
        	)
        	var uploadTask = firebase.doUploadFile(authUser.uid, filename, file)
        	uploadTask.on('state_changed', function(){}, function(){}, snapshot => {
        		onSetWorksheetname(filename)
        		window.location.reload()
        	})
        })
        break;
      case FILE_DROPDOWN[3].key:
        document.getElementById('worksheet-header-filename').readOnly = false
        document.getElementById('worksheet-header-filename').focus()
        break;
      case FILE_DROPDOWN[4].key:
        xtos(slides.getData(), worksheetname)
        break;
      case FILE_DROPDOWN[5].key:
        let today = new Date().toLocaleDateString()
        firebase.trash(authUser.uid).get().then(doc => {
          if (doc.exists) {
            firebase.trash(authUser.uid).update({ [worksheetname]: today })
          } else {
            firebase.trash(authUser.uid).set({ [worksheetname]: today })
          }
        })
        break;
      case FILE_DROPDOWN[7].key:
        setIsOpenDatabaseMysql(true)
        break;
      case FILE_DROPDOWN[8].key:
        setIsOpenDatabaseSqlserver(true)
        break;
      case FILE_DROPDOWN[9].key:
        setIsOpenDatabaseOracle(true)
        break;
    }
  }

  return (
    <>
      <FileWithDropdown text='File' items={FILE_DROPDOWN} onSelect={handleFile} color={color[authUser.uid]}/>
      <ImportDatabaseWithModal databaseType='MySQL' isOpen={isOpenDatabaseMysql} setIsOpen={setIsOpenDatabaseMysql} />
      <ImportDatabaseWithModal databaseType='Microsoft SQL Server' isOpen={isOpenDatabaseSqlserver} setIsOpen={setIsOpenDatabaseSqlserver} />
      <ImportDatabaseOracleWithModal isOpen={isOpenDatabaseOracle} setIsOpen={setIsOpenDatabaseOracle} />
    </>
  )
}

const FileWithDropdown = withDropdown(Header)
const ImportDatabaseWithModal = withModal(ImportDatabase)
const ImportDatabaseOracleWithModal = withModal(ImportDatabaseOracle)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  files: (state.filesState.files || {}),
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
})

const mapDispatchToProps = dispatch => ({
  onSetWorksheetname: (worksheetname) => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname })
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withFirebase,
)(Files)
