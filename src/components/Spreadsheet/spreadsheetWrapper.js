import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Spreadsheet from './index.js'
import { options } from './options.js'

const SpreadsheetWrapper = ({ onSetSpreadsheet }) => {
	useEffect(() => {
		var s = new Spreadsheet('#spreadsheet', options)
		onSetSpreadsheet(s)
	}, [])

	return (
 		<div id="spreadsheet"></div>
	)
}

const mapStateToProps = state => ({
	spreadsheet: (state.spreadsheetState.spreadsheet || {}),
});

const mapDispatchToProps = dispatch => ({
	onSetSpreadsheet: spreadsheet => dispatch({ type: 'SPREADSHEET_SET', spreadsheet }),
})

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
)(SpreadsheetWrapper)
