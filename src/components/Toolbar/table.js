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
// import OFF_COLOR from '../../constants/off-color';

const fontSizes = [
  { pt: 0 },
  { pt: 1 },
  { pt: 2 },
  { pt: 3 },
  { pt: 4 },
  { pt: 5 },
];

export const TABLE_DROPDOWN = [
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
    key: 'Freeze Rows', type: 'secondarymenu', options: fontSizes, style: { width: '40px' },
  },
  { key: 'Freeze Header Row', type: 'item' },
  {
    key: 'Freeze Columns', type: 'secondarymenu', options: fontSizes, style: { width: '40px' },
  },
  { key: 'Freeze Header Column', type: 'item' },
  { type: 'divider' },
  { key: 'Filter Cell', type: 'item' },
];

const Table = ({ slides }) => {
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
        break;
      }
      case TABLE_DROPDOWN[10].key: {
        data.setFreeze(1, data.freeze[1]);
        break;
      }
      case TABLE_DROPDOWN[11].key: {
        data.setFreeze(data.freeze[0], second);
        break;
      }
      case TABLE_DROPDOWN[12].key: {
        data.setFreeze(data.freeze[0], 1);
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
