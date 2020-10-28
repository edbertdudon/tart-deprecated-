//
//  Navigator
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './index.less'

import Editable from './editable'
import withDropdown from '../Dropdown';
import { OFF_COLOR } from '../../constants/off-color'

const NAVIGATOR_DROPDOWN = [
	{key: 'New sheet', type: 'item'},
	{key: 'Rename', type: 'item'},
	{type: 'divider'},
	{key: 'Cut', type: 'item'},
	{key: 'Copy', type: 'item'},
	{key: 'Paste', type: 'item'},
	{key: 'Delete', type: 'item'},
	{key: 'Duplicate', type: 'item'},
]

const ContextMenuDropdown = ({ slide, handleDropdown }) => (
	<ContextMenu id={'right-click' + slide}>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[0].key)}>{NAVIGATOR_DROPDOWN[0].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[1].key)}>{NAVIGATOR_DROPDOWN[1].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[3].key)}>{NAVIGATOR_DROPDOWN[3].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[4].key)}>{NAVIGATOR_DROPDOWN[4].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[5].key)}>{NAVIGATOR_DROPDOWN[5].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[6].key)}>{NAVIGATOR_DROPDOWN[6].key}</MenuItem>
		<MenuItem onClick={() => handleDropdown(NAVIGATOR_DROPDOWN[7].key)}>{NAVIGATOR_DROPDOWN[7].key}</MenuItem>
	</ContextMenu>
)

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Navigator = ({ slides, color, authUser, dataNames, setDataNames, current, setCurrent }) => {
	const handleDropdown = (key, index) => {
		switch(key) {
			case NAVIGATOR_DROPDOWN[0].key:
				setDataNames([...dataNames, "sheet" + slides.sheetIndex])
				setCurrent(dataNames.length)
				var d = slides.addSheet();
				slides.sheet.resetData(d);
				slides.data = d
				break;
			case NAVIGATOR_DROPDOWN[1].key:
				document.getElementById('navigator-text-' + index).readOnly = false
				document.getElementById('navigator-text-' + index).focus()
				break;
			case NAVIGATOR_DROPDOWN[3].key:
				handleDelete(index)
				break;
			case NAVIGATOR_DROPDOWN[4].key:
				slides.copySheet(index)
				break;
			case NAVIGATOR_DROPDOWN[5].key:
				var d = slides.pasteSheet(dataNames, index, false)
				handlePaste(d, index)
				break;
			case NAVIGATOR_DROPDOWN[6].key:
				handleDelete(index)
				break;
			case NAVIGATOR_DROPDOWN[7].key:
				var d = slides.pasteSheet(dataNames, index, true)
				handlePaste(d, index)
				break;
		}
	}

	const handleDelete = index => {
		if (dataNames.length > 1) {
			setDataNames(dataNames.filter((n,i) => index !== i))
			if (current === index) {
				setCurrent(current-1)
				const d = slides.datas[index-1];
				slides.data = d
				slides.deleteSheet(index, index-1)
			} else {
				slides.deleteSheet(index, -1)
			}
		}
	}

	const handlePaste = (d, index) => {
		setDataNames([
			...dataNames.slice(0,index+1),
			d.name,
			...dataNames.slice(index+1,dataNames.length)
		])
		setCurrent(index+1)
		slides.data = d
	}

	const handleSelect = (index) => {
		if (current !== index) {
			const d = slides.datas[index];
			slides.sheet.resetData(d);
			slides.data = d
			setCurrent(index)
		}
	}

	const handleSlidename = (name, index) => {
		slides.datas[index].name = name;
		setDataNames(dataNames.map((item, index) => {
      if (index === current) {
        return name
      } else {
        return item
      }
    }))
	}

	const handleDragEnd = (result) => {
		if (!result.destination) return
		if (result.destination.index === result.source.index) return;
		const dn = reorder(
			dataNames,
			result.source.index,
			result.destination.index
		);
		setDataNames(dn)
		if (result.source.index === current) {
			setCurrent(result.destination.index)
		} else {
			setCurrent(result.source.index)
		}
	}

	// Move Up Down by dragging

	const whiteText = index => {
		return({color: current === index && "#fff"})
	}

	const backgroundColor = index => {
		return({backgroundColor: current === index && OFF_COLOR[color[authUser.uid]]})
	}

	const Item = ({ name, index}) => (
		<div className='navigator-slide' onClick={() => handleSelect(index)} style={backgroundColor(index)}>
			<div className='navigator-number' style={whiteText(index)}>{index+1}</div>
			<Editable
				value={name}
				onCommit={name => handleSlidename(name, index)}
				files={dataNames}
				style={{...backgroundColor(index), ...whiteText(index)}}
				key={name}
				inputId={'navigator-text-' + index}
			/>
		</div>
	)

	const List = () => {
		return dataNames.map((name, index) => (
			<div key={'navigator-item-' + index}>
				<ContextMenuTrigger id={'right-click' + name}>
					<Draggable key={'draggable-' + index} draggableId={'draggable-' + index} index={index}>
						{provided => (
							<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='navigator-slidewrapper'>
								<Item name={name} index={index} />
							</div>
						)}
					</Draggable>
				</ContextMenuTrigger>
				<ContextMenuDropdown slide={name} handleDropdown={key => handleDropdown(key, index)} />
			</div>
		))
	}

  return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="list">
				{provided => (
			    <div className='navigator' ref={provided.innerRef} {...provided.droppableProps}>
						<List />
			    </div>
				)}
			</Droppable>
		</DragDropContext>
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
)(Navigator)
