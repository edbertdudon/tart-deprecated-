import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { getMaxNumberFromFiles, xtos } from '../../../functions'
import withDropdown from '../../Dropdown'
import { OFF_COLOR } from '../../../constants/off-color'
import * as ROUTES from '../../../constants/routes'
import { withFirebase } from '../../Firebase'

export const FILE_DROPDOWN = [
  {key: 'New worksheet', type: 'item'},
  {key: 'Save', type: 'item'},
  {key: 'Duplicate', type: 'item'},
  {key: 'Rename worksheet', type: 'item'},
  {key: 'Download as xlsx', type: 'item'},
  {key: 'Move to trash', type: 'link', path: ROUTES.HOME},
  {type: 'divider'},
  {key: 'Connect to MySQL', type: 'item'},
  {key: 'Connect to Microsoft SQL server', type: 'item'},
  {key: 'Connect to Oracle SQL', type: 'item'},
]

const Files = ({ firebase, authUser, worksheetname, files, onSetWorksheetname, color }) => {
  const handleFile = key => {
    console.log('passed file')
    switch (key) {
      case 'New worksheet':
        let filename = "Untitled Worksheet " + getMaxNumberFromFiles(files[authUser.uid])
        firebase.doUploadFile(
          authUser.uid,
          filename,
          new File (
            [JSON.stringify(DEFAULT_INITIAL_SLIDES)],
            filename,
            {type: "application/json"}
          )
        ).on('state_changed', function(){}, function(){}, snapshot => {
          onSetWorksheet(filename, authUser.uid)
          window.location.reload()
        })
        break;
      case 'Save':
        // const file = new File (
        // 	[JSON.stringify(slides)],
        // 	worksheet[authUser.uid],
        // 	{type: "application/json"}
        // )
        // firebase.doUploadFile(authUser.uid, worksheet, file)
        break;
      case 'Duplicate':
        // let worksheetname = worksheet[authUser.uid]
        // if (worksheetname.includes(' copy')) {
        // 	worksheetname = worksheetname.substring(0, worksheetname.indexOf(' copy'))
        // }
        // // Can we persist files deeper than one level instead?
        // firebase.doListFiles(authUser.uid).then(res => {
        // 	const file = new File (
        // 		[JSON.stringify(slides)],
        // 		worksheetname + ' copy ' + getMaxNumberFile(res.items, worksheetname),
        // 		{type: "application/json"}
        // 	)
        // 	var uploadTask = firebase.doUploadFile(authUser.uid, filename, file)
        // 	uploadTask.on('state_changed', function(){}, function(){}, snapshot => {
        // 		onSetWorksheet(filename, authUser.uid)
        // 		window.location.reload()
        // 	})
        // })
        break;
      case 'Rename worksheet':
        break;
      case 'Download as xlsx':
        // xtos(slides, worksheet[authUser.uid])
        break;
      case 'Move to trash':
        let today = new Date().toLocaleDateString()
        firebase.trash(authUser.uid).get().then(doc => {
          if (doc.exists) {
            firebase.trash(authUser.uid).update({ [worksheetname[authUser.uid]]: today })
          } else {
            firebase.trash(authUser.uid).set({ [worksheetname[authUser.uid]]: today })
          }
        })
        break;
    }
  }

  return (
    <FileWithDropdown
      items={FILE_DROPDOWN}
      onOpen={handleFile}
      classname='worksheet-header-dropdown-header'
      color={OFF_COLOR[color[authUser.uid]]}
    />
  )
}

const Header = ({ classname, text, hover, onHover, isOpen, onOpen, color }) => (
  <div
    className={classname}
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
  >
  File
  </div>
)

const FileWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  files: (state.filesState.files || {}),
  color: (state.colorState.colors || {}),
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
