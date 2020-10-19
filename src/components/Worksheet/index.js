import React, { useState } from 'react';
import './index.less'

import Header from './header'
import Toolbar from '../Toolbar'
import Formulabar from '../Formulabar'
import RightSidebar from '../RightSidebar'
import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js'

const Worksheet = () => {
	const [saving, setSaving] = useState(false)
	const [rightSidebar, setRightSidebar] = useState('none')

	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header saving={saving} setSaving={setSaving} />
			<Toolbar rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<Formulabar />
			<RightSidebar rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<SpreadsheetWrapper />
		</div>
	)
}
export default Worksheet;
