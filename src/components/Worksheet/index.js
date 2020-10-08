import React, { useEffect } from 'react';
import './index.less'

import SpreadsheetWrapper from '../Spreadsheet/spreadsheetWrapper.js'
import Header from './Header'
import Toolbar from './Toolbar'
// <Toolbar />
const Worksheet = () => {
	return (
 		<div className='worksheet' onContextMenu={e => {e.preventDefault(); return false;}}>
			<Header />
			<SpreadsheetWrapper />
		</div>
	)
}
export default Worksheet;
