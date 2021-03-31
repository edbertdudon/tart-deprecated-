//
//  Slide
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { ContextMenuTrigger } from 'react-contextmenu';
import Message from './message';
import { formulan } from '../Spreadsheet/cloudr/formula';
import reservedKeywords from '../../constants/reservedkeywords';
import { useOutsideAlerter, createFile } from '../../functions';
import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const Slide = ({
  firebase, authUser, color, worksheetname, slides, dataNames, current,
  onSetDataNames, onSetCurrent, onSetSaving, children, value, index, text, setText,
  show, setShow, Dropdown, errortext, setErrorText, error, setError, onDropdown,
}) => {
  const wrapperRef = useRef(null);

  function save() {
    onSetSaving(true);
    firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
      .then(() => onSetSaving(false));
  }

  const checkIllegalChange = () => {
    if (show === true) {
      setShow(false);

      let doesExist = false;
      for (let i = 0; i < dataNames.length; i += 1) {
        if (dataNames[i].name === text) {
          doesExist = true;
          break;
        }
      }
      if (formulan.some((formula) => formula === text)
        || reservedKeywords.some((word) => word === text)) {
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

  const handleSelect = () => {
    if (current !== index) {
      slides.selectSheet(index);
      onSetCurrent(index);
    }
  };

  const handleClose = () => setErrorText('');

  const backgroundColor = () => ({ backgroundColor: current === index && 'rgb(234, 234, 234)' });
  // const backgroundColor = () => (
  //   { backgroundColor: current === index && OFF_COLOR[color[authUser.uid]] }
  // );
  // const whiteText = () => ({ color: current === index && '#fff' });

  return (
    <>
      <ContextMenuTrigger id={`right-click${text}`}>
        <div
          className="navigator-slide"
          onClick={handleSelect}
          style={backgroundColor()}
          ref={wrapperRef}
        >
          <div className="navigator-number">
            {index + 1}
          </div>
          {children}
        </div>
      </ContextMenuTrigger>
      <Dropdown
        slide={text}
        onDropdown={onDropdown}
        color={OFF_COLOR[color[authUser.uid]]}
      />
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
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
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
)(Slide);
