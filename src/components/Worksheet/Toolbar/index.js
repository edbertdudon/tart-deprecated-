import React from 'react'

import Files from './file'
import Edit from './edit'
import Insert from './insert'
import Table from './table'
import View from './view'

const Toolbar = () => {
	return (
		<div className='worksheet-toolbar'>
			<Files />
			<Edit />
			<Insert />
			<Table />
			<View />
		</div>
	)
}

export default Toolbar
