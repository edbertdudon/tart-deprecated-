import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../../Dropdown'
import { OFF_COLOR } from '../../../constants/off-color'
import { withFirebase } from '../../Firebase'

export const EDIT_DROPDOWN = [
  {key: 'Undo', type: 'item'},
  {key: 'Redo', type: 'item'},
  {type: 'divider'},
  {key: 'Cut', type: 'item'},
  {key: 'Copy', type: 'item'},
  {key: 'Paste', type: 'item'},
  {type: 'divider'},
  {key: 'Delete sheet', type: 'item'},
]

const Edit = ({ color, authUser }) => {
  const handleEdit = key => {
    switch (key) {
      case 'Undo':
        break;
      case 'Redo':
        break;
      case 'Cut':
        break;
      case 'Copy':
        break;
      case 'Paste':
        // if (slides[currentSlide].type === "sheet") {
          let paste = new Event("paste")
          // document.dispatchEvent(paste)
        // }
        break;
      case 'Delete sheet':
        break;
    }
  }

  return (
    <EditWithDropdown
      items={EDIT_DROPDOWN}
      onOpen={handleEdit}
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
    Edit
  </div>
)

const EditWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
  withFirebase,
)(Edit)
