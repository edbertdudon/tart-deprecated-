import React, { useState, useRef, useEffect } from 'react'

const Number = ({ initialNumber, errorMessage }) => {
	const [number, setNumber] = useState(initialNumber)
	const [error, setError] = useState(null)

	const handleChange = e => {
		let input = e.target.value
		setNumber(input)
		if (isNaN(parseFloat(input))) {
			setError(errorMessage)
		} else {
			setError(null)
		}
	}

  return (
    <div className='rightsidebar-variable'>
			<input
				type="number"
				name="confidenceLevel"
				value={number}
				onChange={handleChange}
				className='rightsidebar-input'
			/>
			{error && <p>{error}</p>}
    </div>
  )
}

export default Number
