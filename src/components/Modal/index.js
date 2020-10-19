import React, { useState } from 'react'
import './index.less'

const withModal = Component => (props) => {
  const handleClose = () => props.setIsOpen(false)

  const handleSelect = () => {
    handleClose()
    props.onSelect()
  }

  return (
    <>
      {props.isOpen &&
          <div className='modal' style={{ height: props.height }}>
            <Component {...props} onClose={handleClose} onSelect={handleSelect} />
          </div>
      }
    </>
  )
}

export default withModal;
