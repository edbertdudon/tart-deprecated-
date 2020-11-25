import React from 'react'

const Number = ({ label, value, onChange, error  }) => {
  return (
		<>
			<div className='rightsidebar-label'>{label}</div>
			<div className='rightsidebar-variable'>
				<input
					className='rightsidebar-input'
					type="number"
					value={value}
					onChange={onChange}
				/>
				{error && <p>{error}</p>}
			</div>
		</>
  )
}

export default Number
