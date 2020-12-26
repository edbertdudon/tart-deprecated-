import React, { useState } from 'react'
import Variable from './variable'
import withLists from '../../RightSidebar/withLists'
import withListsDropdown from '../../RightSidebar/withListsDropdown'

const Matrix = ({ variables, selected, setSelected, text }) => {

	const handleUpdateVariable = newSelectedVariables => setSelected(newSelectedVariables)

	const handleAddVariable = activeOption => {
		let newSelectedVariables = [...selected, activeOption]
		setSelected(newSelectedVariables)
	}

	return (
		<>
			<div className='rightsidebar-label'>{text}</div>
			{selected.map((selected, index) => (
				<OptionsWithListsDropdown
					onChange={handleUpdateVariable}
					options={variables}
					name={variables[selected]}
					selection={selected}
					setSelection={setSelected}
					currentSelection={index}
					key={selected}
				/>
			))}
			<OptionsWithLists
				onChange={handleAddVariable}
				options={variables}
				name={selected.length < 1 ? '' : 'Add additonal variable'}
				styles={{color: "#aaa"}}
			/>
		</>
	)
}

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)
const OptionsWithListsDropdown = withListsDropdown(Options)

export default Matrix
