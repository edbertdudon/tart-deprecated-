//
//  Worksheet
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useRef } from 'react';
import './index.less'

import Header from './header'
import Toolbar from '../Toolbar'
import Toggle from '../Toggle'
import Formulabar from '../Formulabar'
import RightSidebar from '../RightSidebar'
import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js'

const Worksheet = () => {
	const [text, setText] = useState('')
	const [saving, setSaving] = useState(false)
	const [rightSidebar, setRightSidebar] = useState('none')
	const [statistic, setStatistic] = useState(null)
	const [schart, setSchart] = useState([])

	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header saving={saving} setSaving={setSaving} />
			<Toolbar rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<Formulabar text={text} />
			<Toggle rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} setStatistic={setStatistic} setSchart={setSchart}/>
			<RightSidebar
				rightSidebar={rightSidebar}
				setRightSidebar={setRightSidebar}
				statistic={statistic}
				setStatistic={setStatistic}
				schart={schart}
				setSchart={setSchart}
			/>
			<SpreadsheetWrapper setSaving={setSaving} setText={setText} />
		</div>
	)
}
export default Worksheet;
