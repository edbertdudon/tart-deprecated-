import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

const View = ({ authUser, color, slides, rightSidebar, onSetRightSidebar, navigator, setNavigator }) => {
  const VIEW_DROPDOWN = [
    {key: 'Navigator', type: 'toggle', visibility: navigator},
    {key: 'Chart Editor', type: 'toggle', visibility: rightSidebar === 'charteditor'},
  ]

  const handleView = key => {
    const { sheet, options } = slides;
    switch (key) {
      case VIEW_DROPDOWN[0].key:
        setNavigator(!navigator)
        if (navigator) {
          sheet.table.el.style.marginLeft = '0'
          sheet.overlayerEl.el.style.left = '0'
          sheet.horizontalScrollbar.el.el.style.left = '0'
          options.showNavigator = false
        } else {
          sheet.table.el.style.marginLeft = '125px'
          sheet.overlayerEl.el.style.left = '125px'
          sheet.horizontalScrollbar.el.el.style.left = '125px'
          options.showNavigator = true
        }
        break;
      case VIEW_DROPDOWN[1].key:
        handleToggle('charteditor')
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
    <ViewWithDropdown
      items={VIEW_DROPDOWN}
      onSelect={handleView}
      classname='worksheet-header-dropdown-header'
      color={OFF_COLOR[color[authUser.uid]]}
    />
  )
}

const Header = ({ classname, hover, onHover, isOpen, onOpen, color }) => (
  <div
    className={classname}
    onClick={onOpen}
    onMouseEnter={onHover}
    onMouseLeave={onHover}
    style={{ color: (hover || isOpen) && color }}
  >
    View
  </div>
)

const ViewWithDropdown = withDropdown(Header)

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
)(View)
