//
//  Editable
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
// Known Issues:
// Alert users when they make an illegal change ie. same name headers, spaces within name
//
import React, {useState, useEffect, useRef} from 'react'

const Editable = ({ value, onCommit, files, classname, style, reference, inputId }) => {
  const [text, setText] = useState(value)
  const [show, setShow] = useState(false)
  const wrapperRef = useRef(null)

  const checkIllegalChange = () => {
    if (show === true) {
      setShow(false)
      for (var i=0; i<files.length; i++) {
        if (files[i].name === text) {
          var doesExist = true
          break
        } else {
          var doesExist = false
        }
      }
      if (!doesExist) {
        onCommit(text)
      } else {
        setText(value)
      }
    }
  }

  const useOutsideAlerter = (ref) => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        checkIllegalChange()
      }
    }
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' || event.key === 'Tab') {
        checkIllegalChange()
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
  useOutsideAlerter(wrapperRef, show)

  const handleChange = e => setText(e.target.value)

  const handleShow = () => setShow(true)

  return (
    <>
      { show &&
        <input
          type="text"
          onChange={handleChange}
          className='leftsidebar-input'
          value={text}
          ref={wrapperRef}
          id={inputId}
        />
      }
      <div className='leftsidebar-text' style={style} onDoubleClick={handleShow}>
        {text}
      </div>
    </>
  )
}

export default Editable
