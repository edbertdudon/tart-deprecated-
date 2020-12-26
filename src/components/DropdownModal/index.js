import React, { useState, useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import './index.less'

const withDropdownModal = Component => (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [filteredOption, setFilteredOption] = useState(props.items.filter(item => item.category === 0))
  const wrapperRef = useRef(null)

  const useOutsideAlerter = (ref) => {
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
    }, [])
  }
  useOutsideAlerter(wrapperRef)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleSearch = e => {
    setSearch(e.target.value)
    if (e.target.value.length > 0) {
      setIsSearching(true)
      setFilteredOption(props.items.filter(item => {
        if (props.name === 'formulas') {
          return item.key.toLowerCase().includes(e.target.value.toLowerCase())
        } else {
          return item.title.toLowerCase().includes(e.target.value.toLowerCase())
        }
      }))
    } else {
      setIsSearching(false)
      setFilteredOption(props.items.filter(item => item.category === category))
    }
  }

  const handleSelect = item => {
    setIsOpen(!isOpen)
    props.onSelect(item.key)
  }

  const handleSelectCategory = i => {
    setCategory(i)
    setFilteredOption(props.items.filter(item => item.category === i))
    setIsSearching(false)
    setSearch("")
  }

  return (
    <div className='dropdownmodal' ref={wrapperRef}>
      <Component onToggle={handleOpen} isSelected={isOpen} {...props} />
      {isOpen &&
        <div className={props.classname}>
          <input
            type="text"
            name="search"
            className='dropdownmodal-search'
            placeholder="Search"
            onChange={handleSearch}
            value={search}
          />
          <div className='dropdownmodal-category'>
            {props.categories.map((cat, i) => (
              <div
                className='dropdownmodal-item'
                onClick={() => handleSelectCategory(i)}
                key={i}
                style={{
                  backgroundColor: i === category && !isSearching ? props.color : "#ebebeb",
                  color: i === category && !isSearching ? "#fff" : "#000000"
                }}
              >
                {cat}
              </div>
            ))}
          </div>
          <div className='dropdownmodal-selection' style={{height: props.height - 40 + "px"}}>
            {filteredOption.map((item, i) => (
              <div className='dropdownmodal-item' onClick={() => handleSelect(item)} key={i}>
                {props.name === 'formulas' ? item.key : item.title}
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default withDropdownModal;
