//
//  table.js
//  Sciepp
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Sciepp. All rights reserved.
//
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Header from './header';
import { sheetReset } from '../Spreadsheet/component/sheet';
// import OFF_COLOR from '../../constants/off-color';

const fontSizes = [
  { pt: 0 },
  { pt: 1 },
  { pt: 2 },
  { pt: 3 },
  { pt: 4 },
  { pt: 5 },
];

const Table = ({ slides }) => {
  const TABLE_DROPDOWN = [
    { key: 'Insert Row', type: 'item' },
    { key: 'Insert Column', type: 'item' },
    { type: 'divider' },
    { key: 'Delete Row', type: 'item' },
    { key: 'Delete Column', type: 'item' },
    { type: 'divider' },
    { key: 'Merge Cells', type: 'item' },
    { key: 'Unmerge Cells', type: 'item' },
    { type: 'divider' },
    {
      key: 'Freeze Rows', type: 'secondarymenu', options: fontSizes, style: { width: '40px' }, name: 'freezerows',
    },
    {
      key: 'Freeze Header Row', secondarytext: 'Unfreeze Header Row', type: 'freezeheaderrow',
    },
    {
      key: 'Freeze Columns', type: 'secondarymenu', options: fontSizes, style: { width: '40px' }, name: 'freezecolumns',
    },
    {
      key: 'Freeze Header Column', secondarytext: 'Unfreeze Header Column', type: 'freezeheadercolumn',
    },
    { type: 'divider' },
    { key: 'Filter Cell', type: 'item' },
  ];

  const handleTable = (key, second) => {
    const { data } = slides;
    switch (key) {
      case TABLE_DROPDOWN[0].key: {
        data.insert('row');
        break;
      }
      case TABLE_DROPDOWN[1].key: {
        data.insert('column');
        break;
      }
      case TABLE_DROPDOWN[3].key: {
        data.delete('row');
        break;
      }
      case TABLE_DROPDOWN[4].key: {
        data.delete('column');
        break;
      }
      case TABLE_DROPDOWN[6].key: {
        data.merge();
        break;
      }
      case TABLE_DROPDOWN[7].key: {
        data.unmerge();
        break;
      }
      case TABLE_DROPDOWN[9].key: {
        data.setFreeze(second, data.freeze[1]);
        sheetReset.call(slides.sheet);
        break;
      }
      case TABLE_DROPDOWN[10].key: {
        if (second) {
          data.setFreeze(0, data.freeze[1]);
        } else {
          data.setFreeze(1, data.freeze[1]);
        }
        sheetReset.call(slides.sheet);
        break;
      }
      case TABLE_DROPDOWN[11].key: {
        data.setFreeze(data.freeze[0], second);
        sheetReset.call(slides.sheet);
        break;
      }
      case TABLE_DROPDOWN[12].key: {
        if (second) {
          data.setFreeze(data.freeze[0], 0);
        } else {
          data.setFreeze(data.freeze[0], 1);
        }
        sheetReset.call(slides.sheet);
        break;
      }
      case TABLE_DROPDOWN[14].key: {
        data.autofilter();
        break;
      }
      default:
    }

    slides.reRender();
  };

  return (
    <Header
      classname="dropdown-content"
      text="Table"
      items={TABLE_DROPDOWN}
      onSelect={handleTable}
      index={3}
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
)(Table);
