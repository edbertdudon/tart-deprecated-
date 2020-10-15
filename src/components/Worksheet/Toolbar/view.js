import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../../Dropdown'
import { OFF_COLOR } from '../../../constants/off-color'

const View = ({ authUser, color, isLoaded, rightSideBar, setRightSideBar }) => {
  const VIEW_DROPDOWN = [
    {key: 'Connections', type: 'toggle', visibility: rightSideBar === 'connections'},
    {key: 'Chart', type: 'toggle', visibility: rightSideBar === 'chart'},
    {key: 'Format', type: 'toggle', visibility: rightSideBar === 'format'},
    {key: 'Statistics', type: 'toggle', visibility: rightSideBar === 'statistics'},
    {key: 'Optimize', type: 'toggle', visibility: rightSideBar === 'optimize'},
  ]

  const handleView = key => {
    switch (key) {
      case VIEW_DROPDOWN[0].key:
        handleToggle('connections')
        break;
      case VIEW_DROPDOWN[1].key:
        handleToggle('chart')
        break;
      case VIEW_DROPDOWN[2].key:
        handleToggle('format')
        break;
      case VIEW_DROPDOWN[3].key:
        handleToggle('statistics')
        break;
      case VIEW_DROPDOWN[4].key:
        handleToggle('optimize')
        break;
    }
  }

  const handleToggle = (select) => {
    if (rightSideBar !== select) {
      setRightSideBar(select)
    } else {
      setRightSideBar('none')
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
