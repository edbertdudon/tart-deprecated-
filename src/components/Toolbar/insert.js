import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Header from './header'
import * as ROUTES from '../../constants/routes'
import withDropdown from '../Dropdown'
import { withFirebase } from '../Firebase'
import { OFF_COLOR } from '../../constants/off-color'

const Insert = ({ color, authUser, slides, dataNames, current, onSetDataNames, onSetCurrent }) => {
	const INSERT_DROPDOWN = [
		{key: 'Sheet', type: 'item'},
		{key: 'Chart', type: 'item'},
		{key: 'Statistics', type: 'item'},
		{key: 'Formulas', type: 'item'},
	]

	const handleInsert = key => {
		switch(key) {
			case INSERT_DROPDOWN[0].key:
        var d = slides.addSheet(undefined, undefined, current);
        slides.sheet.resetData(d);
        onSetDataNames([
          ...dataNames.slice(0, current+1),
          d.name,
          ...dataNames.slice(current+1)
        ])
        onSetCurrent(current+1)
        slides.data = d
				break;
			case INSERT_DROPDOWN[1].key:
			  document.getElementById("chartstoggle").click()
				break;
			case INSERT_DROPDOWN[2].key:
				document.getElementById("statisticstoggle").click()
				break;
			case INSERT_DROPDOWN[3].key:
				document.getElementById("formulastoggle").click()
				break;
		}
	}

	return (
    <InsertWithDropdown text='Insert' items={INSERT_DROPDOWN} onSelect={handleInsert} color={OFF_COLOR[color[authUser.uid]]} />
	)
}

const InsertWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
	color: (state.colorState.colors || {}),
	slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
  current: (state.currentState.current || 0),
})

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
})

export default compose(
	connect(
		mapStateToProps,
    mapDispatchToProps,
	),
	withFirebase,
)(Insert)
