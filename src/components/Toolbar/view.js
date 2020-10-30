import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

const View = ({ authUser, color, slides, isLoaded, rightSidebar, setRightSidebar, navigator, setNavigator }) => {
  const VIEW_DROPDOWN = [
    {key: 'Navigator', type: 'toggle', visibility: navigator},
    {key: 'Chart Editor', type: 'toggle', visibility: rightSidebar === 'charteditor'},
  ]

  const handleView = key => {
    switch (key) {
      case VIEW_DROPDOWN[0].key:
        setNavigator(!navigator)
        if (navigator) {
          document.getElementById('slide-table').style.marginLeft = '0'
          document.getElementById('slide-overlayer').style.left = '0'
          document.getElementById('slide-scrollbar-horizontal').style.left = '0'
          // document.getElementById('slide-bottombar').style.display = 'none'
          slides.options.showNavigator = false
        } else {
          document.getElementById('slide-table').style.marginLeft = '125px'
          document.getElementById('slide-overlayer').style.left = '125px'
          document.getElementById('slide-scrollbar-horizontal').style.left = '125px'
          // document.getElementById('slide-bottombar').style.display = 'block'
          slides.options.showNavigator = true

        }
        break;
      case VIEW_DROPDOWN[1].key:
        handleToggle('charteditor')
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
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(View)
