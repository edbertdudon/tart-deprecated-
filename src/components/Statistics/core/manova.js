import React, { useState } from 'react'
import Variable from './variable'
import withLists from '../../RightSidebar/withLists'
import withListsDropdown from '../../RightSidebar/withListsDropdown'

const TEST_STATISTICS = ["Pillai's trace", "Wilk's lambda", "Hotelling-Lawley trace", "Roy"]

const Manova = ({ variables, onChange, hasBlocks, hasIndependent2, hasCovariate, hasSubject, hasBetween }) => {
	const [test, setTest] = useState(null)
	const [dependents, setDependents] = useState([])
	const [independent, setIndependent] = useState(null)
	const [blocks, setBlocks] = useState(null)
	const [independent2, setIndependent2] = useState(null)
	const [covariate, setCovariate] = useState(null)
	const [subject, setSubject] = useState(null)
	const [between1, setBetween1] = useState(null)
	const [between2, setBetween2] = useState(null)

	const handleUpdateTest = activeOption => {
		setTest(activeOption)
		onChange(activeOption, dependents, independent, blocks, independent2, covariate, subject, between1, activeOption)
	}

	const handleUpdateDependents = newDependents => {
		setDependents(newDependents)
		onChange(test, newDependents, independent, blocks, independent2, covariate, subject, between1, between2)
	}

	const handleAddDependent = activeOption => {
		let newDependents = [...dependents, activeOption]
		setDependents(newDependents)
		onChange(test, newDependents, independent, blocks, independent2, covariate, subject, between1, between2)
	}

	const handleUpdateIndependent = activeOption => {
		setIndependent(activeOption)
		onChange(test, dependents, activeOption, blocks, independent2, covariate, subject, between1, between2)
	}

	const handleUpdateBlocks = activeOption => {
		setBlocks(activeOption)
		onChange(test, dependents, independent, activeOption, independent2, covariate, subject, between1, between2)
	}

	const handleUpdateIndependent2 = activeOption => {
		setIndependent2(activeOption)
		onChange(test, dependents, independent, blocks, activeOption, covariate, subject, between1, between2)
	}

	const handleUpdateCovariate = activeOption => {
		setCovariate(activeOption)
		onChange(test, dependents, independent, blocks, independent2, activeOption, subject, between1, between2)
	}

	const handleUpdateSubject = activeOption => {
		setSubject(activeOption)
		onChange(test, dependents, independent, blocks, independent2, covariate, activeOption, between1, between2)
	}

	const handleUpdateBetweenSubjects1 = activeOption => {
		setBetween1(activeOption)
		onChange(test, dependents, independent, blocks, independent2, covariate, subject, activeOption, between2)
	}

	const handleUpdateBetweenSubjects2 = activeOption => {
		setBetween2(activeOption)
		onChange(test, dependents, independent, blocks, independent2, covariate, subject, between1, activeOption)
	}

	return (
		<>
			<div className='rightsidebar-label'>Dependent variables</div>
			{dependents.map((dependent, index) => (
				<OptionsWithListsDropdown
					onChange={handleUpdateDependents}
					options={variables}
					name={variables[dependent]}
					selection={dependents}
					setSelection={setDependents}
					currentSelection={index}
				/>
			))}
			<OptionsWithLists
				onChange={handleAddDependent}
				options={variables}
				name={dependents.length < 1 ? '' : 'Add additonal variable'}
				styles={{color: "#aaa"}}
			/>
			<Variable
				label="Independent variable"
				onChange={handleUpdateIndependent}
				options={variables}
				name={variables[independent]}
			/>
			{hasBlocks &&
				<Variable
					label="Blocking factor"
					onChange={handleUpdateBlocks}
					options={variables}
					name={variables[blocks]}
				/>}
			{hasIndependent2 &&
				<Variable
					label="Independent variable"
					onChange={handleUpdateIndependent2}
					options={variables}
					name={variables[independent2]}
				/>}
			{hasCovariate &&
				<Variable
					label="Covariate"
					onChange={handleUpdateCovariate}
					options={variables}
					name={variables[covariate]}
				/>}
			{hasSubject &&
				<Variable
					label="Subject"
					onChange={handleUpdateSubject}
					options={variables}
					name={variables[subject]}
				/>}
			{hasBetween && <>
				<Variable
					label="Between-subjects variable"
					onChange={handleUpdateBetweenSubjects1}
					options={variables}
					name={variables[between1]}
				/>
				<Variable
					label="Between-subjects variable"
					onChange={handleUpdateBetweenSubjects2}
					options={variables}
					name={variables[between2]}
				/>
			</>}
			<Variable
				label="Test statistic"
				onChange={handleUpdateTest}
				options={TEST_STATISTICS}
				name={TEST_STATISTICS[test]}
			/>
		</>
	)
}

const Options = ({ option }) => option
const OptionsWithLists = withLists(Options)
const OptionsWithListsDropdown = withListsDropdown(Options)

export default Manova
