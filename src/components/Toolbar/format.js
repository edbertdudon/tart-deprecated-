import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import Header from './header'
import { fontSizes } from '../Spreadsheet/core/font'
import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

const Format = ({ authUser, color, slides, rightSidebar, onSetRightSidebar }) => {
  const FORMAT_DROPDOWN = [
		{key: 'Bold', type: 'item'},
    {key: 'Italic', type: 'item'},
    {key: 'Underline', type: 'item'},
    {key: 'Strikethrough', type: 'item'},
    {type: 'divider'},
    {key: 'Edit Chart Data...', type: 'item'},
    {type: 'divider'},
    {key: 'Font size', type: 'secondarymenu', options: fontSizes, style:{width: "55px"}},
    {type: 'divider'},
    {key: 'Horizontal Align Left', type: 'item'},
    {key: 'Horizontal Aign Center', type: 'item'},
    {key: 'Horizontal Align Right', type: 'item'},
    {type: 'divider'},
    {key: 'Vertical Align Top', type: 'item'},
    {key: 'Vertical Align Middle', type: 'item'},
    {key: 'Vertical Align Bottom', type: 'item'},
    {type: 'divider'},
    {key: 'Text wrapping', type: 'item'},
  ]

  const handleFormat = (key, second) => {
    const { data, sheet } = slides
    const { toolbar } = slides.sheet
    switch (key) {
      case FORMAT_DROPDOWN[0].key:
        data.setSelectedCellAttr('font-bold', toolbar.boldEl.toggle());
        break;
      case FORMAT_DROPDOWN[1].key:
        data.setSelectedCellAttr('font-italic', toolbar.italicEl.toggle());
        break;
      case FORMAT_DROPDOWN[2].key:
        data.setSelectedCellAttr('font-underline', toolbar.underlineEl.toggle());
        break;
      case FORMAT_DROPDOWN[3].key:
        data.setSelectedCellAttr('strike', toolbar.strikeEl.toggle());
        break;
      case FORMAT_DROPDOWN[5].key:
        handleToggle('charteditor')
        break;
      case FORMAT_DROPDOWN[7].key:
        toolbar.fontSizeEl.setState(second)
        data.setSelectedCellAttr('font-size', second);
        break;
      case FORMAT_DROPDOWN[9].key:
        data.setSelectedCellAttr('align', "left");
        break;
      case FORMAT_DROPDOWN[10].key:
        data.setSelectedCellAttr('align', "center");
        break;
      case FORMAT_DROPDOWN[11].key:
        data.setSelectedCellAttr('align', "right");
        break;
      case FORMAT_DROPDOWN[13].key:
        data.setSelectedCellAttr('valign', "top");
        break;
      case FORMAT_DROPDOWN[14].key:
        data.setSelectedCellAttr('valign', "middle");
        break;
      case FORMAT_DROPDOWN[14].key:
        data.setSelectedCellAttr('valign', "bottom");
        break;
      case FORMAT_DROPDOWN[17].key:
        data.setSelectedCellAttr('textwrap', toolbar.textwrapEl.toggle());
        break;
    }
  }

  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      onSetRightSidebar(select)
    } else {
      onSetRightSidebar('none')
    }
  }

  return (
    <FormatWithDropdown text='Format' items={FORMAT_DROPDOWN} onSelect={handleFormat} color={OFF_COLOR[color[authUser.uid]]}
    />
  )
}

const FormatWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
  rightSidebar: (state.rightSidebarState.rightSidebar || "none"),
})

const mapDispatchToProps = dispatch => ({
  onSetRightSidebar: rightSidebar => dispatch({ type: 'RIGHTSIDEBAR_SET', rightSidebar }),
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Format)
