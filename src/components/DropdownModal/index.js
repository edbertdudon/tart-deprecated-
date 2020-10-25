import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import './index.less'

const withDropdownModal = Component => (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState(0)
  const [filteredOption, setFilteredOption] = useState(props.items.filter(item => item.category === 0))
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

  const handleSearch = e => {
    let filter = props.items.filter(item => item.category === category)
      .filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFilteredOption(filter)
  }

  const handleSelect = (item) => {
    setIsOpen(!isOpen)
    props.onSelect(item)
  }

  const handleSelectCateogry = i => {
    setCategory(i)
    setFilteredOption(props.items.filter(item => item.category === i))
  }

  return (
    <div ref={wrapperRef}>
      <Component onToggle={handleOpen} isSelected={isOpen} {...props} />
      {isOpen &&
        <div className='dropdownmodal-content'>
          <input
            type="text"
            name="search"
            className='dropdownmodal-search'
            placeholder="Search"
            onChange={handleSearch}
          />
          <div className='dropdownmodal-category'>
            {props.categories.map((cat, i) => (
              <div
                className='dropdownmodal-item'
                onClick={() => handleSelectCateogry(i)}
                key={i}
                style={{
                  backgroundColor: i === category ? props.color : "#ebebeb",
                  color: i === category ? "#fff" : "#000000"
                }}
              >
                {cat}
              </div>
            ))}
          </div>
          <div className='dropdownmodal-selection'>
            {filteredOption.map((item, i) => (
              <div className='dropdownmodal-item' onClick={() => handleSelect(item.name)} key={i} >
                {item.name}
              </div>
      			))}
          </div>
        </div>
      }
    </div>
  )
}

export default withDropdownModal;
