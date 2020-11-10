import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

const Format = ({ authUser, color, slides, rightSidebar, setRightSidebar }) => {
  const FORMAT_DROPDOWN = [
		{key: 'Bold', type: 'item'},
    {key: 'Italic', type: 'item'},
    {key: 'Underline', type: 'item'},
    {key: 'Strikethrough', type: 'item'},
    {type: 'divider'},
    {key: 'Edit Chart Data...', type: 'item'},
    {type: 'divider'},
    {key: 'Font size', type: 'item'},
    {key: 'Align', type: 'item'},
    {key: 'Text wrapping', type: 'item'},
  ]

  const handleFormat = key => {
    switch (key) {
      case FORMAT_DROPDOWN[0].key:
        slides.data.setSelectedCellAttr('font-bold', true);
        break;
      case FORMAT_DROPDOWN[1].key:
        slides.data.setSelectedCellAttr('font-italic', true);
        break;
      case FORMAT_DROPDOWN[2].key:
        slides.data.setSelectedCellAttr('font-underline', true);
        break;
      case FORMAT_DROPDOWN[3].key:
        slides.data.setSelectedCellAttr('strike', true);
        break;
      case FORMAT_DROPDOWN[5].key:
        setRightSidebar('charteditor')
        break;
      case FORMAT_DROPDOWN[7].key:
        slides.data.setSelectedCellAttr('font-size', 8);
        break;
      case FORMAT_DROPDOWN[8].key:
        slides.data.setSelectedCellAttr('valign', "top");
        slides.data.setSelectedCellAttr('halign', "");
        break;
      case FORMAT_DROPDOWN[9].key:
        slides.data.setSelectedCellAttr('textwrap', true);
        break;
    }
  }

  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      setRightSidebar(select)
    } else {
      setRightSidebar('none')
    }
  }

  return (
    <FormatWithDropdown
      items={FORMAT_DROPDOWN}
      onSelect={handleFormat}
      color={OFF_COLOR[color[authUser.uid]]}
    />
  )
}

const Header = ({ hover, onHover, isOpen, onOpen, color }) => (
  <div
    className='worksheet-header-dropdown-header'
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
  >
    Format
  </div>
)

const FormatWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(Format)
