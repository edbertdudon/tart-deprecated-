//
//  Variable
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import withLists from '../../RightSidebar/withLists'

const Variable = ({ label, setSelected, options, name }) => {

	const handleSelect = i => setSelected(i)

	return (
		<>
			<div className='rightsidebar-label'>{label}</div>
			<OptionsWithLists onChange={handleSelect} options={options} name={name} />
		</>
	)
}

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)

export default Variable
