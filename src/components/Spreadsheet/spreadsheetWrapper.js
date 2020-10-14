//
//  spreadsheetWrapper.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
//  Deploy:
//  1. cd bac
//  2. firebase init
//  3. npm run build
//  4. firebase deploy
//
//  Known Limitations:
//  Headers within headers? Drilldown
//  hover shade selected formula after "=..."
//

import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Spreadsheet from './index.js'
import { options } from './options.js'
import { withFirebase } from '../Firebase'
import { DEFAULT_INITIAL_SLIDES } from '../../constants/default'

const SpreadsheetWrapper = ({ firebase, authUser, slides, worksheetname, onSetSlides }) => {
	const firstUpdate = useRef(true)

	useLayoutEffect(() => {
		// const unsubscribe = firebase.doDownloadFile(
		// 	authUser.uid,
		// 	worksheetname
		// ).then(res => {
			var s = new Spreadsheet('#spreadsheet', options)
			// 	.loadData(res)
			// console.log(s)
			// onSetSlides(s)
		// 	if (firstUpdate.current) {
		// 		firstUpdate.current = false;
		// 		return;
		// 	}
		// })
		// return () => unsubscribe
	}, [])

// useEffect(() => {
// 	const timer = setTimeout(() => {
// 		if (firstUpdate.current === false && slides[0].data !== null) {
// 			props.firebase.doUploadFile(
// 				authUser.uid,
// 				worksheetname,
// 				new File (
// 					[JSON.stringify(slides)],
// 					worksheetname,
// 					{type: "application/json"}
// 				)
// 			)
// 		}
// 	}, 750)
// 	return () => clearTimeout(timer)
// }, [slides])

	return (
 		<div id="spreadsheet"></div>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	slides: (state.slidesState.slides || {}),
	worksheetname: (state.worksheetnameState.worksheetname || ''),
});

const mapDispatchToProps = dispatch => ({
	onSetSlides: slides => dispatch({ type: 'SLIDES_SET', slides }),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
)(SpreadsheetWrapper)
