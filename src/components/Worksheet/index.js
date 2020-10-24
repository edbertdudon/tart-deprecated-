//
//  Worksheet
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
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

	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header saving={saving} setSaving={setSaving} />
			<Toolbar rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<Formulabar text={text} />
			<Toggle rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<RightSidebar rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} setSaving={setSaving} />
			<SpreadsheetWrapper setSaving={setSaving} setText={setText} />
		</div>
	)
}
export default Worksheet;
