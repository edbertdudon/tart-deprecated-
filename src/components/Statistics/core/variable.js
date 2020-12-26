import React from 'react'
import withLists from '../../RightSidebar/withLists'

const Variable = ({ label, onChange, options, name }) => (
	<>
		<div className='rightsidebar-label'>{label}</div>
		<OptionsWithLists onChange={onChange} options={options} name={name} />
	</>
)

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)

export default Variable
