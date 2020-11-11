import React from 'react'
import './index.less'

import Files from './file'
import Edit from './edit'
import Insert from './insert'
import Table from './table'
import Format from './format'
import View from './view'

const Toolbar = ({ rightSidebar, setRightSidebar, navigator, setNavigator, dataNames, setDataNames, current, setCurrent }) => {
	return (
		<div className='worksheet-toolbar'>
			<Files />
			<Edit />
			<Insert
				rightSidebar={rightSidebar}
				setRightSidebar={setRightSidebar}
				dataNames={dataNames}
				setDataNames={setDataNames}
				current={current}
				setCurrent={setCurrent}
			/>
			<Table rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<Format rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} />
			<View rightSidebar={rightSidebar} setRightSidebar={setRightSidebar} navigator={navigator} setNavigator={setNavigator} />
		</div>
	)
}

export default Toolbar
