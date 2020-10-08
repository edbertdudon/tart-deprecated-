import React, { useState, useEffect, useContext, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import './index.less';

import EditableInput from '../../EditableInput'
import Context from '../../Context'
// import Dropdown from '../../Spreadsheet/component/dropdown';

import { withFirebase } from '../../Firebase'

const Header = ({ firebase, authUser, worksheet, files }) => {
	const [showContextmenu, setShowContextmenu] = useState(false)
	const {rename, setRename} = useContext(Context)
	const inputRef = useRef(null)

	useEffect(() => {
		// inputRef.current.appendChild(contextMenu);
		// if (files[authUser.uid] === undefined) {
		// 	firebase.doListFiles(authUser.uid).then(res => {
		// 		onSetFiles(res.items, authUser.uid)
		// 	})
		// }
	}, [])

	const handleChange = name => {
		// const file = new File ([JSON.stringify(slides)], name, {type: "application/json"})
		// firebase.doUploadFile(authUser.uid, name, file)
		// firebase.doDeleteFile(authUser.uid, worksheet[authUser.uid])
		// onSetWorksheet(name, authUser.uid)
	}

	const handleSetRename = () => setRename(false)

	const handleContextmenu = () => {
		setShowContextmenu(!showContextmenu)
	}

	return (
		<div className='worksheet-header'>
			<div className='worksheet-header-right' onClick={handleContextmenu}>
				EB
				<div className='worksheet-header-contextmenu' ref={inputRef}></div>
			</div>
			<div className='worksheet-header-center'>
				<EditableInput
					// value={worksheet[authUser.uid].replace(/\.[^/.]+$/, "")}
					value='asdfkalsdjflkasjdf'
					onCommit={handleChange}
					// files={files[authUser.uid]}
					classname='worksheet-header-filename'
					rename={rename}
					onSetRename={handleSetRename}
				/>
			</div>
		</div>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	worksheetname: (state.worksheetnameState.worksheetname || {}),
	files: (state.filesState.files || {}),
});

const mapDispatchToProps = dispatch => ({
	onSetWorksheetname: worksheetname => dispatch({ type: 'WORKSHEETNAME_SET', worksheetname }),
	onSetFiles: (files, uid) => dispatch({type: 'FILES_SET', files, uid}),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
)(Header)
