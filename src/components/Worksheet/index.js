import React, { useEffect } from 'react';
import './index.less'

import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js'
import Header from './header'
import Toolbar from './toolbar'

const Worksheet = () => {
	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header />
			<Toolbar />
			<SpreadsheetWrapper />
		</div>
	)
}
export default Worksheet;
