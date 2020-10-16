import React, { useState, useRef, useEffect } from 'react'

const withLists = Component => (props) => {
	const [showOptions, setShowOptions] = useState(false)
	const [activeOption, setActiveOption] = useState(null)
	const wrapperRef = useRef(null)

	const useOutsideAlerter = (ref) => {
		const handleOutsideClick = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setShowOptions(false)
			}
		}
		const handleKeyPress = (event) => {
			if (event.key === 'Enter' || event.key === 'Tab') {
				setShowOptions(false)
			}
		}
		useEffect(() => {
			document.addEventListener("mousedown", handleOutsideClick)
			document.addEventListener("keypress", handleKeyPress)
			return () => {
				document.removeEventListener("mousedown", handleOutsideClick)
				document.removeEventListener("keypress", handleKeyPress)
			}
		})
	}
	useOutsideAlerter(wrapperRef)

	const toggleComponent = () => setShowOptions(!showOptions)

	const handleSelectComponent = () => {
		setShowOptions(false)
		props.onChange(activeOption)
		setActiveOption(null)
	}

	const toggleHover = (index) => setActiveOption(index)

	return (
		<div ref={wrapperRef}>
			<div className='rightsidebar-dropdown' onClick={toggleComponent} style={props.styles}>
				{props.name}
			</div>
			{(showOptions && props.options.length > 0) &&
				<ul>
					{props.options.map((option, index) => {
						if (index === activeOption) {
							var classNameOptionActive = 'option-active'
						}
						return (
							<li className={classNameOptionActive} key={index} onClick={handleSelectComponent} onMouseEnter={() => toggleHover(index)}>
								<Component option={option} />
							</li>
						)
					})}
				</ul>
			}
		</div>
	)
}

export default withLists
