import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'
import './index.less'

import { OFF_COLOR } from '../../constants/off-color'

const Item = ({ text, onOpen }) =>
	<div className='dropdown-item' onClick={() => onOpen(text)}>
		{text}
	</div>

const Redirect = ({ path, text }) =>
	<Link to={{ pathname: path }} className='dropdown-item'>
		{text}
	</Link>

const getDropdownStates = (item, i, onOpen, component) => ({
	item: <Item text={item.key} onOpen={onOpen} key={item.key}/>,
	link: <Redirect text={item.key} path={item.path} key={item.key}/>,
	component: <div key={item.key}>{component}</div>,
	divider: <hr key={i}/>,
})

const withDropdown = Component => (props) => {
	const [hover, setHover] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const wrapperRef = useRef(null)

	const useOutsideAlerter = ref => {
		const handleOutsideClick = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsOpen(false)
			}
		}
		useEffect(() => {
			document.addEventListener("mousedown", handleOutsideClick)
			return () => {
				document.removeEventListener("mousedown", handleOutsideClick)
			}
		})
	}
	useOutsideAlerter(wrapperRef)

	const handleOpen = () => setIsOpen(!isOpen)
	const handleHover = () => setHover(!hover)

	return (
		<div className='dropdown' ref={wrapperRef}>
			<Component
				classname={props.classname}
				text={props.text}
				hover={hover}
				onHover={handleHover}
				isOpen={isOpen}
				onOpen={handleOpen}
				color={props.color}
				style={props.style}
			/>
			{isOpen &&
				<div className='dropdown-content' style={props.style}>
					{props.items.map((item, i) =>
						getDropdownStates(item, i, props.onOpen, item.component)[item.type]
					)}
				</div>
			}
		</div>
	)
}

export default withDropdown;
