import React from 'react'

import Files from './file'
import Edit from './edit'

const Toolbar = () => {
	return (
		<div className='worksheet-toolbar'>
			<Files />
			<Edit />
		</div>
	)
}

export default Toolbar
