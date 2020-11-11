import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { Link } from 'react-router-dom'
import Icon from '@mdi/react';
import { mdilChevronRight } from '@mdi/light-js'
// import { mdiMagnify, mdiBrush, mdiMathIntegral } from '@mdi/js'
import './index.less'

import { OFF_COLOR } from '../../constants/off-color'

const Item = ({ text, onSelect }) =>
	<div className='dropdown-item' onClick={() => onSelect(text)}>
		{text}
	</div>

const Redirect = ({ path, text }) =>
	<Link to={{ pathname: path }} className='dropdown-item'>
		{text}
	</Link>

const Toggle = ({ text, onSelect, isOpen }) =>
	<div className='dropdown-item' onClick={() => onSelect(text)}>
		{(isOpen ? 'Hide ' : 'Show ') + text}
	</div>

const SecondaryMenu = ({ text, items, style, onSelect }) => {
	const [hover, setHover] = useState(false)

	const handleHover = () => setHover(!hover)

	return (
		<div className='dropdown'>
			<div className='dropdown-item' onMouseEnter={handleHover} onMouseLeave={handleHover}>
				{text}
				<div className='dropdown-item-arrow'>
					<Icon path={mdilChevronRight} size={0.9}/>
				</div>
			</div>
			{hover &&
				<div className='dropdown-content-second' style={style}>
					{items.map((item, i) =>
						<Item text={item.pt} onSelect={() => onSelect(text, item.pt)} key={item.pt} />
					)}
				</div>
			}
		</div>
	)
}

const getDropdownStates = (item, i, onSelect, component, isOpen) => ({
	item: <Item text={item.key} onSelect={onSelect} key={item.key} />,
	link: <Redirect text={item.key} path={item.path} key={item.key} />,
	toggle: <Toggle text={item.key} onSelect={onSelect} key={item.key} isOpen={isOpen} />,
	secondarymenu: <SecondaryMenu text={item.key} items={item.options} style={item.style} onSelect={onSelect} key={item.key} />,
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

	const handleSelect = (selection, second) => {
		setIsOpen(!isOpen)
		props.onSelect(selection, second)
	}

	return (
		<div className='dropdown' ref={wrapperRef}>
			<Component
				classname={props.classname}
				text={props.text}
				hover={hover}
				onHover={handleHover}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				onOpen={handleOpen}
				color={props.color}
				style={props.style}
			/>
			{isOpen &&
				<div className='dropdown-content' style={props.style}>
					{props.items.map((item, i) =>
						getDropdownStates(item, i, handleSelect, item.component, item.visibility)[item.type]
					)}
				</div>
			}
		</div>
	)
}

export default withDropdown;
