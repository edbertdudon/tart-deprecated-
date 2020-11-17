//
//  Worksheet
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useRef } from 'react';
import { compose } from 'recompose'
import './index.less'

import Header from './header'
import Toolbar from '../Toolbar'
import Toggle from '../Toggle'
import Formulabar from '../Formulabar'
import Navigator from '../Navigator'
import RightSidebar from '../RightSidebar'
import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js'
import { withAuthorization, withEmailVerification } from '../Session'

const Worksheet = () => {
	const [text, setText] = useState({ text: '', ri: 0, ci: 0 })
	const [saving, setSaving] = useState(false)
	const [navigator, setNavigator] = useState(true)
	const [statistic, setStatistic] = useState(null)
	const [schart, setSchart] = useState([])

	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header saving={saving} setSaving={setSaving} />
			<Toolbar navigator={navigator} setNavigator={setNavigator} />
			<Toggle setStatistic={setStatistic} setSchart={setSchart} />
			<Formulabar text={text} />
			{navigator && <Navigator />}
			<RightSidebar statistic={statistic} setStatistic={setStatistic} schart={schart} setSchart={setSchart} />
			<SpreadsheetWrapper setSaving={setSaving} setText={setText} />
		</div>
	)
}

const condition = authUser => !!authUser

export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(Worksheet)
