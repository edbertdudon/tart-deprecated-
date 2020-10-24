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
    let filter = props.items.filter(item => {
      if (item.category === category) {
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      }
    })
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
  // <div className='dropdownmodal-item' onClick={() => handleSelect(item.name)} key={i}>
  //   {item.name}
  // </div>
  return (
    <div ref={wrapperRef}>
      <button
        className='dropdownmodal-button'
        onClick={handleOpen}
        style={{backgroundColor: isOpen ? "#ebebeb": "#fff" }}
      >
        <Icon path={icon} size={0.8}/>
      </button>
      {isOpen &&
        <div className='dropdownmodal-content'>
          <input
            type="text"
            name="search"
            className='dropdownmodal-search'
            placeholder="Search"
            onChange={handleSearch}
          />
          {props.categories.map((category, i) => (
            <div className='dropdownmodal-category' onClick={() => handleSelectCateogry(i)} key={i}>
              {category}
            </div>
          ))}
          {filteredOption.map((item, i) => (
            <Component item={item} onSelect={handleSelect} index={i} />
    			))}
        </div>
      }
    </div>
  )
}

export default withDropdownModal;
