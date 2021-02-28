//
//  edit.js
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Header from './header';
import { sheetReset } from '../Spreadsheet/component/sheet';
// import { OFF_COLOR } from '../../constants/off-color';

export const EDIT_DROPDOWN = [
  { key: 'Undo', type: 'item' },
  { key: 'Redo', type: 'item' },
  { type: 'divider' },
  { key: 'Cut', type: 'item' },
  { key: 'Copy', type: 'item' },
  { key: 'Paste', type: 'item' },
  { type: 'divider' },
  { key: 'Delete', type: 'item' },
];

const Edit = ({ slides }) => {
  const handleEdit = (key) => {
    const { data, sheet } = slides;
    switch (key) {
      case EDIT_DROPDOWN[0].key: {
        data.undo(sheet);
        sheetReset.call(sheet);
        break;
      }
      case EDIT_DROPDOWN[1].key: {
        data.redo(sheet);
        sheetReset.call(sheet);
        break;
      }
      case EDIT_DROPDOWN[3].key: {
        data.cut();
        sheet.selector.showClipboard();
        break;
      }
      case EDIT_DROPDOWN[4].key: {
        data.copy();
        sheet.selector.showClipboard();
        break;
      }
      case EDIT_DROPDOWN[5].key: {
        data.paste();
        // if (data.settings.mode === 'read') return;
        // if (data.paste('all', msg => xtoast('Tip', msg))) {
        //   sheetReset.call(sheet);
        // } else if (evt) {
        //   const cdata = evt.clipboardData.getData('text/plain');
        //   data.pasteFromText(cdata);
        //   sheetReset.call(sheet);
        // }
        break;
      }
      case EDIT_DROPDOWN[7].key: {
        data.deleteCell();
        break;
      }
      default:
    }

    slides.reRender();
  };

  return (
    <Header
      classname="dropdown-content"
      text="Edit"
      items={EDIT_DROPDOWN}
      onSelect={handleEdit}
      // color={OFF_COLOR[color[authUser.uid]]}
    />
  );
};

const mapStateToProps = (state) => ({
  // authUser: state.sessionState.authUser,
  // color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
});

export default compose(
  connect(
    mapStateToProps,
  ),
)(Edit);
