//
//  LeftSidebar
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import './index.less'

import EditableInput from '../EditableInput'
import withDropdown from '../Dropdown';
import { OFF_COLOR } from '../../constants/off-color'

const LEFTSIDEBAR_DROPDOWN = [
	{key: 'New sheet', type: 'item'},
	{key: 'Rename', type: 'item'},
	{type: 'divider'},
	{key: 'Cut', type: 'item'},
	{key: 'Copy', type: 'item'},
	{key: 'Paste', type: 'item'},
	{key: 'Delete', type: 'item'},
	{key: 'Duplicate', type: 'item'},
]

const ContextMenuDropdown = ({ id, handleDropdown }) => (
	<ContextMenu id={id}>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[0].key)}>{LEFTSIDEBAR_DROPDOWN[0].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[1].key)}>{LEFTSIDEBAR_DROPDOWN[1].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[3].key)}>{LEFTSIDEBAR_DROPDOWN[3].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[4].key)}>{LEFTSIDEBAR_DROPDOWN[4].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[5].key)}>{LEFTSIDEBAR_DROPDOWN[5].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[6].key)}>{LEFTSIDEBAR_DROPDOWN[6].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(LEFTSIDEBAR_DROPDOWN[7].key)}>{LEFTSIDEBAR_DROPDOWN[7].key}</MenuItem>
	</ContextMenu>
)

const LeftSidebar = ({ slides, color, authUser }) => {
	const handleDropdown = key => {
		switch(key) {
			case FILE_DROPDOWN[0].key:
				break;
			case FILE_DROPDOWN[1].key:
				break;
			case FILE_DROPDOWN[3].key:
				break;
			case FILE_DROPDOWN[4].key:
				break;
			case FILE_DROPDOWN[5].key:
				break;
			case FILE_DROPDOWN[6].key:
				break;
			case FILE_DROPDOWN[7].key:
				break;
		}
	}
	console.log(slides)
	const handleSheetName = (name, index) => {}

	const handleSelect = (index) => {
		console.log(slides.bottombar.items[index])
		slides.bottombar.clickSwap(slides.bottombar.items[index])
	}

	// Move Up Down by dragging

	const whiteText = (slide) => {
		return({color: slides.data.name === slide && "#fff"})
	}

	const backgroundColor = (slide) => {
		return({backgroundColor: slides.data.name === slide && OFF_COLOR[color[authUser.uid]]})
	}

  return (
    <div className='leftsidebar'>
      {slides.bottombar.dataNames.map((slide, index) =>
        <>
          <ContextMenuTrigger id={index}>
            <div className='leftsidebar-slide' onClick={() => handleSelect(index)} style={backgroundColor(slide)}>
              <div className='leftsidebar-number' style={whiteText(slide)}>{index+1}</div>
              <EditableInput
                value={slide}
                onCommit={(name) => handleSlidename(name, index)}
                files={slides.bottombar.dataNames}
                classname='leftsidebar-text'
								style={{...backgroundColor(slide), ...whiteText(slide)}}
								key={slide}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuDropdown id={index} handleDropdown={handleDropdown} />
        </>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
	authUser: state.sessionState.authUser,
  slides: (state.slidesState.slides || {}),
	color: (state.colorState.colors || {}),
})

export default compose(
  connect(
    mapStateToProps,
  ),
)(LeftSidebar)
