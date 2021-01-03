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

const SpreadsheetWrapper = ({ firebase, authUser, slides, worksheetname, color,
	onSetSlides, onSetDataNames, onSetCurrent, setSaving, setText }) => {
	const firstUpdate = useRef(true)

	useLayoutEffect(() => {
		const unsubscribe = firebase.doDownloadFile(authUser.uid, worksheetname).then(res => {
			options.style.offcolor = OFF_COLOR[color[authUser.uid]]
			var s = new Spreadsheet('#spreadsheet', options)
				.loadData(res)
				.on('cell-edited', (text, ri, ci) => {
          setText({ text: text, ri: ri, ci: ci })
        })
				.on('cell-selected', (text, ri, ci) => {
					if (text === null) {
						setText({ text: '', ri: ri, ci: ci })
					} else {
						setText({ text: text.text, ri: ri, ci: ci })
					}
				})
				.change(data => {
					// const timer = setTimeout(() => {
					// 	console.log(slides.getData())
					// 	if (firstUpdate.current === false && slides.data !== null) {
					// 		setSaving(true)
					// 		firebase.doUploadFile(
					// 			authUser.uid,
					// 			worksheetname,
					// 			new File ([JSON.stringify(slides.getData())], worksheetname, {type: "application/json"})
					// 		).then(() => setSaving(false))
					// 	}
					// }, 750)
					// return () => clearTimeout(timer)
				})
			s.validate()
			s.data = s.datas[0]
			const dataNames = s.datas.map(data => data.name)
			onSetDataNames([...dataNames])
			onSetCurrent(0)
			onSetSlides(s)
			console.log(s)
			if (firstUpdate.current) {
				firstUpdate.current = false;
			}
		})
		return () => unsubscribe
	}, [])

	return (
 		<div id="spreadsheet"></div>
	)
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	slides: (state.slidesState.slides || {}),
	worksheetname: (state.worksheetnameState.worksheetname || ''),
	color: (state.colorState.colors || {}),
	dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
	current: (state.currentState.current || 0),
});

const mapDispatchToProps = dispatch => ({
	onSetSlides: slides => dispatch({ type: 'SLIDES_SET', slides }),
	onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
	onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
})

export default compose(
	withFirebase,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
)(SpreadsheetWrapper)
