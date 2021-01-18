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
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { formulan } from '../Spreadsheet/cloudr/formula';
import { useOutsideAlerter } from '../../functions';
import withModal from '../Modal';
import { OFF_COLOR } from '../../constants/off-color';

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

const Item = ({ text, onSelect, color }) => {
  const [hover, setHover] = useState(false);

  const handleHover = () => setHover(!hover);

  return (
    <div
      className="dropdown-item"
      onClick={() => onSelect(text)}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      style={{ backgroundColor: hover && color, color: hover ? '#fff' : '#000000' }}
    >
      {text}
    </div>
  );
};

const ContextMenuDropdown = ({ slide, onDropdown, color }) => (
  <ContextMenu id={`right-click${slide}`}>
    <Item text={NAVIGATOR_DROPDOWN[0].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[1].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[3].key} onSelect={onDropdown} color={color} />
    <hr />
    <Item text={NAVIGATOR_DROPDOWN[4].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[5].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[6].key} onSelect={onDropdown} color={color} />
    <Item text={NAVIGATOR_DROPDOWN[7].key} onSelect={onDropdown} color={color} />
  </ContextMenu>
);

const Editable = ({
  slides, color, authUser, dataNames, current, onSetDataNames, onSetCurrent, value, index,
}) => {
  const [text, setText] = useState(value);
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);
  const [error, setError] = useState(false);
  const [errortext, setErrorText] = useState('');

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
    }
  };

  const paste = (d) => {
    onSetDataNames([
      ...dataNames.slice(0, index + 1),
      d.name,
      ...dataNames.slice(index + 1),
    ]);
    onSetCurrent(index + 1);
    slides.data = d;
  };

  const handleDropdown = (key) => {
    switch (key) {
      case NAVIGATOR_DROPDOWN[0].key:
        var d = slides.addSheet(undefined, undefined, current);
        slides.sheet.resetData(d);
        onSetDataNames([
		      ...dataNames.slice(0, current + 1),
		      d.name,
		      ...dataNames.slice(current + 1),
		    ]);
        onSetCurrent(current + 1);
        slides.data = d;
        break;
      case NAVIGATOR_DROPDOWN[1].key:
        // Not working as expected
        handleShow();
        // handleSelect();
        break;
      case NAVIGATOR_DROPDOWN[3].key:
        deleteSheet();
        break;
      case NAVIGATOR_DROPDOWN[4].key:
        slides.copySheet(index);
        break;
      case NAVIGATOR_DROPDOWN[5].key:
        var d = slides.pasteSheet(dataNames, index, false);
        paste(d);
        break;
      case NAVIGATOR_DROPDOWN[6].key:
        deleteSheet();
        break;
      case NAVIGATOR_DROPDOWN[7].key:
        var d = slides.pasteSheet(dataNames, index, true);
        paste(d);
        break;
    }
  };

  const handleChange = (e) => setText(e.target.value);

  const handleShow = () => setShow(true);

  const handleSelect = () => {
    if (current !== index) {
      const d = slides.datas[index];
      slides.sheet.resetData(d);
      slides.data = d;
      onSetCurrent(index);
    }
  };

  const backgroundColor = () => ({ backgroundColor: current === index && OFF_COLOR[color[authUser.uid]] });

  const whiteText = () => ({ color: current === index && '#fff' });

  const handleClose = () => setErrorText('');

  return (
    <>
      <ContextMenuTrigger id={`right-click${text}`}>
        <div className="navigator-slide" onClick={handleSelect} style={backgroundColor()} ref={wrapperRef}>
          <div className="navigator-number" style={whiteText()}>{index + 1}</div>
          {show
            ? <input type="text" onChange={handleChange} className="navigator-input" value={text} autoFocus />
            :	(
              <div className="navigator-text" style={{ ...backgroundColor(index), ...whiteText(index) }} onDoubleClick={handleShow}>
                {text}
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
        style={{ width: '199px', left: 'Calc((100% - 199px)/2)' }}
      />
    </>
  );
};

const Message = ({ text, onSelect }) => (
  <form className="modal-form">
    <p>{`The name '${text}' is already taken or is a formula. Formula names are reserved.`}</p>
    <button className="modal-button" onClick={onSelect}>Ok</button>
  </form>
);

const MessageWithModal = withModal(Message);

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  slides: (state.slidesState.slides || {}),
  color: (state.colorState.colors || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Editable);
