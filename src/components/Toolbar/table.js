import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

export const TABLE_DROPDOWN = [
  {key: 'Insert Row', type: 'item'},
  {key: 'Insert Column', type: 'item'},
  {type: 'divider'},
  {key: 'Delete Row', type: 'item'},
  {key: 'Delete Column', type: 'item'},
  {type: 'divider'},
  {key: 'Merge Cells', type: 'item'},
  {key: 'Unmerge Cells', type: 'item'},
  {type: 'divider'},
  {key: 'Freeze Cells', type: 'item'},
  {key: 'Unfreeze Cells', type: 'item'},
  {type: 'divider'},
  {key: 'Filter Cell', type: 'item'},
  {type: 'divider'},
  {key: 'Optimize', type: 'item'},
]

const Table = ({ color, authUser, slides, rightSidebar, setRightSidebar }) => {
  const handleTable = key => {
    const { data } = slides
    switch (key) {
      case TABLE_DROPDOWN[0].key:
        data.insert('row')
        break;
      case TABLE_DROPDOWN[1].key:
        data.insert('column')
        break;
      case TABLE_DROPDOWN[3].key:
        data.delete('row')
        break;
      case TABLE_DROPDOWN[4].key:
        data.delete('column')
        break;
      case TABLE_DROPDOWN[6].key:
        data.merge()
        break;
      case TABLE_DROPDOWN[7].key:
        data.unmerge()
        break;
      case TABLE_DROPDOWN[9].key:
        const { ri, ci } = data.selector
        data.setFreeze(ri, ci)
        break;
      case TABLE_DROPDOWN[10].key:
        data.setFreeze(0, 0)
        break;
      case TABLE_DROPDOWN[12].key:
        data.autofilter()
        break;
      case TABLE_DROPDOWN[14].key:
        handleToggle('optimize')
        break;
    }
    slides.reRender()
  }

  const handleToggle = (select) => {
    if (rightSidebar !== select) {
      setRightSidebar(select)
    } else {
      setRightSidebar('none')
    }
  }

  return (
    <TableWithDropdown
      items={TABLE_DROPDOWN}
      onSelect={handleTable}
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
    Table
  </div>
)

const TableWithDropdown = withDropdown(Header)

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  color: (state.colorState.colors || {}),
  slides: (state.slidesState.slides || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(Table)
