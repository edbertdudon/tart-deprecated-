import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

const View = ({ authUser, color, isLoaded, rightSidebar, setRightSidebar }) => {
  const VIEW_DROPDOWN = [
    {key: 'Connections', type: 'toggle', visibility: rightSidebar === 'connections'},
    {key: 'Charts', type: 'toggle', visibility: rightSidebar === 'charts'},
    {key: 'Chart Editor', type: 'toggle', visibility: rightSidebar === 'charteditor'},
    {key: 'Statistics', type: 'toggle', visibility: rightSidebar === 'statistics'},
    {key: 'Optimize', type: 'toggle', visibility: rightSidebar === 'optimize'},
    {key: 'Formulas', type: 'toggle', visibility: rightSidebar === 'formulas'},
  ]

  const handleView = key => {
    switch (key) {
      case VIEW_DROPDOWN[0].key:
        handleToggle('connections')
        break;
      case VIEW_DROPDOWN[1].key:
        handleToggle('charts')
        break;
      case VIEW_DROPDOWN[2].key:
        handleToggle('charteditor')
        break;
      case VIEW_DROPDOWN[3].key:
        handleToggle('statistics')
        break;
      case VIEW_DROPDOWN[4].key:
        handleToggle('optimize')
        break;
      case VIEW_DROPDOWN[5].key:
        handleToggle('formulas')
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
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(View)
