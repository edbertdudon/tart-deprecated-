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
import Navigator from '../Navigator'
import RightSidebar from '../RightSidebar'
import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js'

const Worksheet = () => {
	const [dataNames, setDataNames] = useState(["sheet1"])
	const [current, setCurrent] = useState(0)
	const [text, setText] = useState({ text: '', ri: 0, ci: 0 })
	const [saving, setSaving] = useState(false)
	const [navigator, setNavigator] = useState(true)
	const [rightSidebar, setRightSidebar] = useState('none')
	const [statistic, setStatistic] = useState(null)
	const [schart, setSchart] = useState([])

	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header saving={saving} setSaving={setSaving} />
			<Toolbar
				rightSidebar={rightSidebar}
				setRightSidebar={setRightSidebar}
				navigator={navigator}
				setNavigator={setNavigator}
				dataNames={dataNames}
				setDataNames={setDataNames}
				setCurrent={setCurrent}
			/>
			<Formulabar text={text} />
			<Toggle rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} setStatistic={setStatistic} setSchart={setSchart} />
			{navigator &&
				<Navigator dataNames={dataNames} setDataNames={setDataNames} current={current} setCurrent={setCurrent} />
			}
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
