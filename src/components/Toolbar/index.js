import React from 'react'
import './index.less'

import Files from './file'
import Edit from './edit'
import Insert from './insert'
import Table from './table'
import Format from './format'
import View from './view'

const Toolbar = ({ navigator, setNavigator }) => {
	return (
		<div className='worksheet-toolbar'>
			<Files />
			<Edit />
			<Insert />
			<Table />
			<Format />
			<View navigator={navigator} setNavigator={setNavigator} />
		</div>
	)
}

export default Toolbar
