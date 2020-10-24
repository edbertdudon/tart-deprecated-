//
//  SpreadsheetWrapper
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
//  Limitations:
//  Headers within headers? Drilldown
//  hover shade selected formula after "=..."
//
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { rRender } from './cloudr'
import Spreadsheet from './index.js'
import { options } from './options.js'
import { withFirebase } from '../Firebase'
import { DEFAULT_INITIAL_SLIDES } from '../../constants/default'
import { OFF_COLOR } from '../../constants/off-color'

const SpreadsheetWrapper = ({ firebase, authUser, slides, worksheetname, color, onSetSlides, setSaving, setText }) => {
	const firstUpdate = useRef(true)

	useLayoutEffect(() => {
		// const unsubscribe = firebase.doDownloadFile(
		// 	authUser.uid,
		// 	worksheetname
		// ).then(res => {
			options.style.offcolor = OFF_COLOR[color[authUser.uid]]
			var s = new Spreadsheet('#spreadsheet', options)
				// .loadData(res)
				.on('cell-edited', (text, ri, ci) => setText(text))
				.on('cell-selected', (text, ri, ci) => {
					if (text === null) {
						setText('')
					} else {
						setText(text.text)
					}
				})
			onSetSlides(s)
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
	// 			setSaving(true)
	// 			props.firebase.doUploadFile(
	// 				authUser.uid,
	// 				worksheetname,
	// 				new File ([JSON.stringify(slides.getData())], worksheetname, {type: "application/json"})
	// 			).then(() => setSaving(false))
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
	color: (state.colorState.colors || {}),
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
