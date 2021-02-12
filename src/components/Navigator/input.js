//
//  Input
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Item from './item';
import MessageWithModal from './messagewithmodal';
import { formulan } from '../Spreadsheet/cloudr/formula';
import { useOutsideAlerter, createFile } from '../../functions';
import { OFF_COLOR } from '../../constants/off-color';
import withModal from '../Modal';
import { withFirebase } from '../Firebase';

const INPUT_DROPDOWN = [
  { key: 'New sheet', type: 'item' },
  { key: 'Rename...', type: 'item' },
  { type: 'divider' },
  { key: 'Delete', type: 'item' },
  { key: 'Refresh Connection', type: 'item' },
];

const ContextMenuDropdown = ({ slide, onDropdown, color }) => (
  <ContextMenu id={`right-click${slide}`}>
    <Item text={INPUT_DROPDOWN[0].key} onSelect={onDropdown} color={color} />
    <Item text={INPUT_DROPDOWN[1].key} onSelect={onDropdown} color={color} />
    <hr />
    <Item text={INPUT_DROPDOWN[3].key} onSelect={onDropdown} color={color} />
    <Item text={INPUT_DROPDOWN[4].key} onSelect={onDropdown} color={color} />
  </ContextMenu>
);

const Input = ({
  firebase, authUser, worksheetname, slides, dataNames, current,
  saving, color, value, index, onSetDataNames, onSetCurrent, onSetSaving,
}) => {
  const [text, setText] = useState(value);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [errortext, setErrorText] = useState('');
  const wrapperRef = useRef(null);

  const checkIllegalChange = () => {
    if (show === true) {
      setShow(false);

      let doesExist = false;
      for (let i = 0; i < dataNames.length; i++) {
        if (dataNames[i].name === text) {
          doesExist = true;
          break;
        }
      }
      if (formulan.some((formula) => formula === text)) {
        doesExist = true;
      }

      if (!doesExist) {
        slides.datas[index].name = text;
        onSetDataNames(dataNames.map((item, i) => {
          if (i === index) {
            return text;
          }
          return item;
        }));

        save();
      } else {
        setText(value);
        setError(true);
        setErrorText(text);
      }
    }
  };

  useOutsideAlerter(wrapperRef, checkIllegalChange);

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

  const handleDropdown = (key) => {
    switch (key) {
      case INPUT_DROPDOWN[0].key: {
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
      case INPUT_DROPDOWN[3].key: {
        deleteSheet();
        break;
      }
      case INPUT_DROPDOWN[4].key: {
        // refresh connection
        // const data = slides.datas[index];
        // const connector = data.delimiter;
        // const config = {
        //
        // };
        // getTableSample(data.connector, firebase);
        break;
      }
    }
  };

  const handleChange = (e) => setText(e.target.value);

  const handleShow = () => setShow(true);

  const handleSelect = () => {
    if (current !== index) {
      slides.swapSheet(index);
      onSetCurrent(index);
    }
  };

  const backgroundColor = () => ({ backgroundColor: current === index && 'rgb(0,0,0,0.05)' });
  // const backgroundColor = () => ({ backgroundColor: current === index && OFF_COLOR[color[authUser.uid]] });

  // const whiteText = () => ({ color: current === index && '#fff' });

  const handleClose = () => setErrorText('');

  function save() {
    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  }

  return (
    <>
      <ContextMenuTrigger id={`right-click${text}`}>
        <div
          className="navigator-slide"
          onClick={handleSelect}
          style={backgroundColor()}
          ref={wrapperRef}
        >
          <div
            className="navigator-number"
            // style={whiteText()}
          >
            {index + 1}
          </div>
          {show
            ? (
              <>
                <input
                  type="text"
                  onChange={handleChange}
                  className="navigator-input"
                  value={text}
                  autoFocus
                />
                <div className="navigator-subtext">Sample</div>
              </>
            )
            :	(
              <div
                className="navigator-text"
                // style={{ ...backgroundColor(index), ...whiteText(index) }}
                onDoubleClick={handleShow}
              >
                {text}
                <div className="navigator-subtext">Sample</div>
              </div>
            )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuDropdown slide={text} onDropdown={handleDropdown} color={OFF_COLOR[color[authUser.uid]]} />
      <MessageWithModal
        text={errortext}
        isOpen={error}
        setIsOpen={setError}
        onSelect={handleClose}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
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
)(Input);
