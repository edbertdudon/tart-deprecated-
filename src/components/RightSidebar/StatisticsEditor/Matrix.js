import React, { useState } from 'react'
import Variable from './Variable'
import withListsDropdown from '../withListsDropdown'
import withLists from '../withLists'

const Matrix = ({ variables, selectedVariables, setSelectedVariables }) => {

	const handleUpdateVariable = newSelectedVariables => setSelectedVariables(newSelectedVariables)

	const handleAddVariable = activeOption => {
		let newSelectedVariables = [...selectedVariables, activeOption]
		setSelectedVariables(newSelectedVariables)
	}

	return (
		<>
			<div className='rightsidebar-label'>Columns</div>
			{selectedVariables.map((selected, index) => (
				<OptionsWithListsDropdown
					onChange={handleUpdateVariable}
					options={variables}
					name={variables[selected]}
					selection={selectedVariables}
					setSelection={setSelectedVariables}
					currentSelection={index}
				/>
			))}
			<OptionsWithLists
				onChange={handleAddVariable}
				options={variables}
				name={selectedVariables.length < 1 ? '' : 'Add additonal variable'}
				styles={{color: "#aaa"}}
			/>
		</>
	)
}

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)
const OptionsWithListsDropdown = withListsDropdown(Options)

export default Matrix
