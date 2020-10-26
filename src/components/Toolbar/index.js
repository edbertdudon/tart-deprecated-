import React from 'react'
import './index.less'

import Files from './file'
import Edit from './edit'
import Insert from './insert'
import Table from './table'
import View from './view'

const Toolbar = ({ rightSidebar, setRightSidebar }) => {
	return (
		<div className='worksheet-toolbar'>
			<Files />
			<Edit />
			<Insert rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<Table rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<View rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
		</div>
	)
}

export default Toolbar
