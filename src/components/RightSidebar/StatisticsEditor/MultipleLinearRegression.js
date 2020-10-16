import React, { useState } from 'react'
import Variable from './Variable'
import withListsDropdown from '../withListsDropdown'
import withLists from '../withLists'

const MultipleLinearRegression = ({ variables, onChange }) => {
	const [dependent, setDependent] = useState(null)
	const [selectedVariables, setSelectedVariables] = useState([])

	const handleUpdateDependent = activeOption => {
		setDependent(activeOption)
		onChange(activeOption, selectedVariables)
	}

	const handleUpdateVariable = newSelectedVariables => {
		setSelectedVariables(newSelectedVariables)
		onChange(dependent, newSelectedVariables)
	}

	const handleAddVariable = activeOption => {
		let newSelectedVariables = [...selectedVariables, activeOption]
		setSelectedVariables(newSelectedVariables)
		onChange(dependent, newSelectedVariables)
	}

	return (
		<>
			<Variable
				label="Dependent variable"
				onChange={handleUpdateDependent}
				options={variables}
				name={variables[dependent]}
			/>
			<div className='rightsidebar-label'>Independent variables</div>
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

export default MultipleLinearRegression
