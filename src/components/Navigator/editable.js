//
//  Editable
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenu } from 'react-contextmenu';
import Slide from './slide';
import Item from './item';
import { createFile } from '../../functions';
import { withFirebase } from '../Firebase';

const NAVIGATOR_DROPDOWN = [
  { key: 'New sheet', type: 'item' },
  { key: 'Rename...', type: 'item' },
  { type: 'divider' },
  { key: 'Cut', type: 'item' },
  { key: 'Copy', type: 'item' },
  { key: 'Paste', type: 'item' },
  { key: 'Delete', type: 'item' },
  { key: 'Duplicate', type: 'item' },
];

const EditableDropdown = ({ slide, onDropdown, color }) => (
  <ContextMenu id={`right-click${slide}`}>
    <Item text={NAVIGATOR_DROPDOWN[0].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[1].key} onSelect={onDropdown} color={color} />
    <hr />
    <Item text={NAVIGATOR_DROPDOWN[3].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[4].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[5].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[6].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[7].key} onSelect={onDropdown} color={color} />
  </ContextMenu>
);

const Editable = ({
  firebase, authUser, worksheetname, slides, dataNames, current,
  value, index, onSetDataNames, onSetCurrent, onSetSaving,
}) => {
  const [text, setText] = useState(value);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [errortext, setErrorText] = useState('');

  function save() {
    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  }

  const deleteSheet = () => {
    if (dataNames.length > 1) {
      onSetDataNames(dataNames.filter((n, i) => index !== i));
      if (current === index) {
        if (index === 0) {
          onSetCurrent(0);
          const d = slides.datas[index + 1];
          slides.data = d;
          slides.deleteSheet(index, index);
        } else {
          onSetCurrent(current - 1);
          const d = slides.datas[index - 1];
          slides.data = d;
          slides.deleteSheet(index, index - 1);
        }
      } else {
        slides.deleteSheet(index, -1);
      }
      save();
    }
  };

  const handleShow = () => setShow(true);

  const handleDropdown = (key) => {
    switch (key) {
      case NAVIGATOR_DROPDOWN[0].key: {
        const names = slides.insertSheet(current);
        onSetDataNames(names);
        onSetCurrent(current + 1);
        save();
        break;
      }
      case NAVIGATOR_DROPDOWN[1].key: {
        handleShow();
        break;
      }
      case NAVIGATOR_DROPDOWN[3].key: {
        deleteSheet();
        break;
      }
      case NAVIGATOR_DROPDOWN[4].key: {
        slides.copySheet(index);
        break;
      }
      case NAVIGATOR_DROPDOWN[5].key: {
        const names = slides.pasteSheet(dataNames, index, false);
        onSetDataNames(names);
        onSetCurrent(index + 1);
        save();
        break;
      }
      case NAVIGATOR_DROPDOWN[6].key: {
        deleteSheet();
        break;
      }
      case NAVIGATOR_DROPDOWN[7].key: {
        const names = slides.pasteSheet(dataNames, index, true);
        onSetDataNames(names);
        onSetCurrent(index + 1);
        save();
        break;
      }
      default:
    }
  };

  const handleChange = (e) => setText(e.target.value);

  return (
    <Slide
      value={value}
      index={index}
      text={text}
      setText={setText}
      show={show}
      setShow={setShow}
      Dropdown={EditableDropdown}
      errortext={errortext}
      setErrorText={setErrorText}
      error={error}
      setError={setError}
      onDropdown={handleDropdown}
    >
      {show ? (
        <input
          type="text"
          onChange={handleChange}
          className="navigator-input"
          value={text}
          autoFocus
        />
      ) : (
        <div className="navigator-text" onDoubleClick={handleShow}>
          {text}
        </div>
      )}
    </Slide>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['Sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Editable);
