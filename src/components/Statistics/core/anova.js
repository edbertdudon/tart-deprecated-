import React, { useState } from 'react'
import Variable from './variable'
import withLists from '../../RightSidebar/withLists'

const Anova = ({ variables, onChange, hasBlocks, hasIndependent2, hasCovariate, hasSubject, hasBetween }) => {
	const [dependent, setDependent] = useState(null)
	const [independent, setIndependent] = useState(null)
	const [blocks, setBlocks] = useState(null)
	const [independent2, setIndependent2] = useState(null)
	const [covariate, setCovariate] = useState(null)
	const [subject, setSubject] = useState(null)
	const [between1, setBetween1] = useState(null)
	const [between2, setBetween2] = useState(null)

	const handleUpdateDependent = activeOption => {
		setDependent(activeOption)
		onChange(activeOption, independent, blocks, independent2, covariate, subject, between1, between2)
	}

	const handleUpdateIndependent = activeOption => {
		setIndependent(activeOption)
		onChange(dependent, activeOption, blocks, independent2, covariate, subject, between1, between2)
	}

	const handleUpdateBlocks = activeOption => {
		setBlocks(activeOption)
		onChange(dependent, independent, activeOption, independent2, covariate, subject, between1, between2)
	}

	const handleUpdateIndependent2 = activeOption => {
		setIndependent2(activeOption)
		onChange(dependent, independent, blocks, activeOption, covariate, subject, between1, between2)
	}

	const handleUpdateCovariate = activeOption => {
		setCovariate(activeOption)
		onChange(dependent, independent, blocks, independent2, activeOption, subject, between1, between2)
	}

	const handleUpdateSubject = activeOption => {
		setSubject(activeOption)
		onChange(dependent, independent, blocks, independent2, covariate, activeOption, between1, between2)
	}

	const handleUpdateBetweenSubjects1 = activeOption => {
		setBetween1(activeOption)
		onChange(dependent, independent, blocks, independent2, covariate, subject, activeOption, between2)
	}

	const handleUpdateBetweenSubjects2 = activeOption => {
		setBetween2(activeOption)
		onChange(dependent, independent, blocks, independent2, covariate, subject, between1, activeOption)
	}

	return (
		<>
			<Variable
				label="Dependent variable"
				onChange={handleUpdateDependent}
				options={variables}
				name={variables[dependent]}
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
			{hasBetween &&
				<>
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
				</>
			}
		</>
	)
}

export default Anova
