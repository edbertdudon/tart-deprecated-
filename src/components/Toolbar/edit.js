import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { sheetReset } from '../Spreadsheet/component/sheet'
import withDropdown from '../Dropdown'
import { OFF_COLOR } from '../../constants/off-color'

export const EDIT_DROPDOWN = [
  {key: 'Undo', type: 'item'},
  {key: 'Redo', type: 'item'},
  {type: 'divider'},
  {key: 'Cut', type: 'item'},
  {key: 'Copy', type: 'item'},
  {key: 'Paste', type: 'item'},
  {type: 'divider'},
  {key: 'Delete', type: 'item'},
]

const Edit = ({ color, authUser, slides }) => {
  const handleEdit = key => {
    const { data, sheet } = slides
    switch (key) {
      case EDIT_DROPDOWN[0].key:
        data.undo()
        sheetReset.call(sheet)
        break;
      case EDIT_DROPDOWN[1].key:
        data.redo()
        sheetReset.call(sheet)
        break;
      case EDIT_DROPDOWN[3].key:
        data.cut()
        sheet.selector.showClipboard();
        break;
      case EDIT_DROPDOWN[4].key:
        data.copy()
        sheet.selector.showClipboard();
        break;
      case EDIT_DROPDOWN[5].key:
        data.paste()
        // if (data.settings.mode === 'read') return;
        // if (data.paste('all', msg => xtoast('Tip', msg))) {
        //   sheetReset.call(sheet);
        // } else if (evt) {
        //   const cdata = evt.clipboardData.getData('text/plain');
        //   data.pasteFromText(cdata);
        //   sheetReset.call(sheet);
        // }
        break;
      case EDIT_DROPDOWN[7].key:
        data.deleteCell()
        break;
    }
    slides.reRender()
  }

  return (
    <EditWithDropdown
      items={EDIT_DROPDOWN}
      onSelect={handleEdit}
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
  slides: (state.slidesState.slides || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(Edit)
