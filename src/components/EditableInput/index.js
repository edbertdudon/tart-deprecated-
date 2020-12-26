//
//  EditableInput
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
// Known Issues:
// Alert users when they make an illegal change ie. same name headers, spaces within name
//
import React, {useState, useEffect, useRef} from 'react'
import { useOutsideAlerter } from '../../functions'
import withModal from '../Modal'

const EditableInput = ({ value, readOnly, onCommit, files, classname, style, inputId, reference, setReadOnly }) => {
  const [text, setText] = useState(value)
  const editableinputRef = useRef(null)
  const [error, setError] = useState(false)
  const [errortext, setErrorText] = useState('')

  const checkIllegalChange = () => {
    if (readOnly === false) {
      setReadOnly(true)
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
        setError(true)
        setErrorText(text)
      }
    }
  }

  useOutsideAlerter(editableinputRef, checkIllegalChange)

  const handleReadonly = () => setReadOnly(false)

  const handleChange = e => setText(e.target.value)

  const handleClose = () => setErrorText('')

  return (
    <>
      {readOnly
        ? <div className={classname} onDoubleClick={handleReadonly} style={style}>
            {text}
          </div>
        : <input
            type="text"
            onChange={handleChange}
            className={classname}
            value={text}
            style={style}
            ref={editableinputRef}
            id={inputId}
            autoFocus
          />
      }
      <MessageWithModal
        text={errortext}
        isOpen={error}
        setIsOpen={setError}
        onSelect={handleClose}
        style={{width: "199px", left: "Calc((100% - 199px)/2)"}}
      />
    </>
  )
}

const Message = ({ text, onSelect }) => (
	<form className='modal-form'>
    <p>{"The name " + text + " is already taken."}</p>
		<button className='modal-button' onClick={onSelect}>Ok</button>
	</form>
)

const MessageWithModal = withModal(Message)

export default EditableInput
