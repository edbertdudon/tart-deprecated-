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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './index.less'

import Editable from './editable'
import { OFF_COLOR } from '../../constants/off-color'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Navigator = ({ slides, color, authUser, dataNames, current, onSetDataNames, onSetCurrent }) => {
	const handleDragEnd = (result) => {
		if (!result.destination) return
		if (result.destination.index === result.source.index) return;
		const dn = reorder(
			dataNames,
			result.source.index,
			result.destination.index
		);
		onSetDataNames(dn)
		if (result.source.index === current) {
			onSetCurrent(result.destination.index)
		} else {
			onSetCurrent(result.source.index)
		}
	}

	const List = () => {
		return dataNames.map((name, index) => (
			<div key={'navigator-item-' + index}>
				<Draggable key={'draggable-' + index} draggableId={'draggable-' + index} index={index}>
					{provided => (
						<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='navigator-slidewrapper'>
							<Editable value={name} index={index} key={name} />
						</div>
					)}
				</Draggable>
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
	dataNames: (state.dataNamesState.dataNames || ["sheet1"]),
	current: (state.currentState.current || 0),
})

const mapDispatchToProps = dispatch => ({
  onSetDataNames: dataNames => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: current => dispatch({ type: 'CURRENT_SET', current }),
})


export default compose(
  connect(
    mapStateToProps,
		mapDispatchToProps,
  ),
)(Navigator)
