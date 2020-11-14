import React, { useState, useRef, useEffect } from 'react'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

import withDropdown from '../Dropdown'

const OPTIONS_DROPDOWN = [
	{key: 'Remove', type: 'item'},
]

const withListsDropdown = Component => (props) => {
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

  const handleSelectComponent = () => {
    setShowOptions(false)
    let newSelection = props.selection.map((selected, j) => {
        if (props.currentSelection === j) {
          return activeOption
        } else {
          return selected
        }
      })
    props.setSelection(newSelection)
    props.onChange(newSelection)
    setActiveOption(null)
  }

  const handleDelete = () => {
		setShowOptions(false)
    if (props.selection.length > 1) {
      let newSelection = props.selection.filter((selected, j) => props.currentSelection !== j)
      props.setSelection(newSelection)
      props.onChange(newSelection)
    }
  }

  const toggleHover = (index) => setActiveOption(index)

	const toggleComponent = () => setShowOptions(false)

  return (
    <div ref={wrapperRef}>
      <ContextMenuTrigger id='withlistsdropdown-rightclick'>
        <div className='rightsidebar-dropdown' onClick={toggleComponent}>
          {props.name}
          <OptionsWithDropdown
            text='...'
  					items={OPTIONS_DROPDOWN}
  					onSelect={handleDelete}
  					style={{marginLeft:"76px", marginTop: "10px"}}
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenu id='withlistsdropdown-rightclick' className='rightsidebar-dropdown-contextmenu'>
        <MenuItem>Delete</MenuItem>
      </ContextMenu>
      {(showOptions && props.options.length) &&
        <div className='rightsidebar-dropdown-content'>
          {props.options.map((option, index) =>
            <div className='rightsidebar-dropdown-item' key={index} onClick={() => handleSelectComponent(index)} onMouseEnter={() => toggleHover(index)}>
              <Component option={option} />
            </div>
					)}
        </div>
      }
    </div>
  )
}

const Options = ({ text, onOpen }) => (
	<div className='rightsidebar-dropdown-rightclick' onClick={onOpen}>
		{text}
	</div>
)

const OptionsWithDropdown = withDropdown(Options)

export default withListsDropdown
