//
//  Navigator
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Input from './input';
import Sample from './sample'
import Editable from './editable';
import './index.less';

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const Navigator = ({
  slides, dataNames, current, onSetDataNames, onSetCurrent,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const destination = result.destination.index;
    const source = result.source.index;

    if (destination === source) return;

    const dn = reorder(dataNames, source, destination);

    onSetDataNames(dn);
    if (source === current) {
      onSetCurrent(destination);
    } else {
      onSetCurrent(source);
    }

    slides.datas = reorder(slides.datas, source, destination);
  };

  const List = () => {
    if (slides && Object.keys(slides).length === 0) {
      return null;
    }

    return slides.datas.map((data, index) => {
      const name = data.name;

      return (
        <div key={`navigator-item-${index}`}>
          <Draggable key={`draggable-${index}`} draggableId={`draggable-${index}`} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                className="navigator-slidewrapper"
              >
                {slides.datas[index].type === 'input'
                  ? <Input value={name} index={index} key={name} />
                  : ('regression' in slides.datas[index] || 'optimization' in slides.datas[index])
                    ? <Sample value={name} index={index} key={name} />
                    : <Editable value={name} index={index} key={name} />}
              </div>
            )}
          </Draggable>
        </div>
      )
    })
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div className="navigator" ref={provided.innerRef} {...provided.droppableProps}>
            <List />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const mapStateToProps = (state) => ({
  slides: (state.slidesState.slides || {}),
  dataNames: (state.dataNamesState.dataNames || ['sheet1']),
  current: (state.currentState.current || 0),
});

const mapDispatchToProps = (dispatch) => ({
  onSetDataNames: (dataNames) => dispatch({ type: 'DATANAMES_SET', dataNames }),
  onSetCurrent: (current) => dispatch({ type: 'CURRENT_SET', current }),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Navigator);
