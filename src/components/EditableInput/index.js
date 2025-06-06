//
//  EditableInput
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
// Known Issues:
// Alert users when they make an illegal change ie. same name headers, spaces within name
//
import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { useOutsideAlerter } from '../../functions';
import Message from './message';

const EditableInput = ({
  value, readOnly, onCommit, worksheets,
  classname, style, inputId, setReadOnly,
}) => {
  const [text, setText] = useState(value);
  const [error, setError] = useState(false);
  const [errortext, setErrorText] = useState('');
  const editableinputRef = useRef(null);

  const checkIllegalChange = () => {
    if (readOnly === false) {
      setReadOnly(true);
      let doesExist = false;

      for (let i = 0; i < worksheets.length; i += 1) {
        if (worksheets[i].name === text) {
          doesExist = true;
          break;
        }
      }

      if (!doesExist) {
        onCommit(text);
      } else {
        setText(value);
        setError(true);
        setErrorText(text);
      }
    }
  };

  useOutsideAlerter(editableinputRef, checkIllegalChange);

  const handleReadonly = () => setReadOnly(false);

  const handleChange = (e) => setText(e.target.value);

  const handleClose = () => setErrorText('');

  return (
    <>
      {readOnly
        ? (
          <div className={classname} onDoubleClick={handleReadonly} style={style}>
            {text}
          </div>
        )
        : (
          <input
            type="text"
            onChange={handleChange}
            className={classname}
            value={text}
            style={style}
            ref={editableinputRef}
            id={inputId}
            autoFocus
          />
        )}
      <Message
        classname="modal"
        text={errortext}
        isOpen={error}
        setIsOpen={setError}
        onSelect={handleClose}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  worksheets: (state.worksheetsState.worksheets || []),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(EditableInput);
