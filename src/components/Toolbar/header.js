import React from 'react'

const Header = ({ text, hover, onHover, isOpen, onOpen }) => (
  <div
    className='worksheet-header-dropdown-header'
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ backgroundColor: (hover || isOpen) && "rgba(0, 0, 0, 0.05)" }}
  >{text}</div>
)

export default Header
