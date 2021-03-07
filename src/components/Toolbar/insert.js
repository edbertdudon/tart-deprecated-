//
//  insert.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Header from './header';
import { createFile } from '../../functions';

// import OFF_COLOR from '../../constants/off-color';
import { withFirebase } from '../Firebase';

const Insert = ({
  firebase, authUser, worksheetname, slides, current, rightSidebar,
  onSetDataNames, onSetCurrent, onSetSaving, onSetRightSidebar,
}) => {
  const INSERT_DROPDOWN = [
    { key: 'Sheet', type: 'item' },
    { key: 'Chart', type: 'item' },
    { key: 'Statistics', type: 'item' },
    { key: 'Formulas', type: 'item' },
    { key: 'Optimization', type: 'item' },
  ];

  const handleInsert = (key) => {
    switch (key) {
      case INSERT_DROPDOWN[0].key: {
        const names = slides.insertSheet(current);
        onSetDataNames(names);
        onSetCurrent(current + 1);
        onSetSaving(true);
        firebase.doUploadWorksheet(authUser.uid, worksheetname, createFile(slides, worksheetname))
          .then(() => onSetSaving(false));
        break;
      }
      case INSERT_DROPDOWN[1].key: {
        document.getElementById('chartstoggle').click();
        break;
      }
      case INSERT_DROPDOWN[2].key: {
        document.getElementById('statisticstoggle').click();
        break;
      }
      case INSERT_DROPDOWN[3].key: {
        document.getElementById('formulastoggle').click();
        break;
      }
      case INSERT_DROPDOWN[4].key: {
        handleToggle('optimize');
        break;
      }
      default:
    }
  };

  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      onSetRightSidebar(select);
      return;
    }
    onSetRightSidebar('none');
  };

  return (
    <Header
      classname="dropdown-content"
      text="Insert"
      items={INSERT_DROPDOWN}
      onSelect={handleInsert}
      // color={OFF_COLOR[color[authUser.uid]]}
    />
  );
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  // color: (state.colorState.colors || {}),
  worksheetname: (state.worksheetnameState.worksheetname || ''),
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
  saving: (state.savingState.saving || false),
  rightSidebar: (state.rightSidebarState.rightSidebar || 'none'),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
  onSetSaving: (saving) => dispatch({ type: 'SAVING_SET', saving }),
  onSetRightSidebar: (rightSidebar) => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Insert);
