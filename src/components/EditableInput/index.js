//
//  EditableInput.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
// Known Issues:
// Alert users when they make an illegal change ie. same name headers, spaces within name
//

import React, {useState, useEffect, useRef} from 'react'

const EditableInput = ({value, onCommit, styleWrapper, files, classname, rename, onSetRename}) => {
  const [text, setText] = useState(value)
  const [readOnly, setReadOnly] = useState(true)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (rename) {
      setReadOnly(false)
      onSetRename()
    }
  }, [rename])

  const checkIllegalChange = () => {
    if (readOnly === false) {
      setReadOnly(true)
      for (var i=0; i<files.length; i++) {
        if (files[i].name === text) {
          var doesExist = true
          // display message
          break
        } else {
          var doesExist = false
        }
      }

      if (!doesExist) {
      // if (!doesExist && !(/\s/g.test(text))) {
        onCommit(text)
      } else {
        setText(value)
      }
    }
  }

  const EDIT_STYLE = {
    ...styleWrapper,
    // backgroundColor: (!readOnly && "#fafafa")
  }
  if (!readOnly) {
    EDIT_STYLE["backgroundColor"] = "#fafafa"
    EDIT_STYLE["color"] = "black"
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

  useOutsideAlerter(wrapperRef, readOnly)

  const handleDoubleClick = () => setReadOnly(false)

  return (
      <input
        type="text"
        onChange={(e) => setText(e.target.value)}
        className={classname}
        value={text}
        readOnly={readOnly}
        onDoubleClick={handleDoubleClick}
        style={EDIT_STYLE}
        ref={wrapperRef}
      />
  )
}

export default EditableInput
