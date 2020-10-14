import React from 'react'
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js'

const LoadingDataSource = () => (
	<div className='datasource-thumbnail'>
		<div className='datasource-icon'>
			<Icon path={mdiLoading} size={5} spin/>
		</div>
	</div>
)

export default LoadingDataSource
