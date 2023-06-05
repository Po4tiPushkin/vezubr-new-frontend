import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

class VzDraggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: props.elements,
    };

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { elements } = nextProps;
    if (elements !== this.state.elements) {
      this.setState({ elements });
    }
  }

  onDragStart() {}

  onDragEnd = (result) => {
    const { onDragEnd } = this.props;
    // dropped outside the list
    if (!result.destination) return;

    const elements = reorder(this.state.elements, result.source.index, result.destination.index);

    this.setState({
      elements,
    });

    if (onDragEnd) {
      onDragEnd(elements, elements[result.destination.index]);
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { elements } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {elements.map((item, index) => (
                <Draggable key={index} draggableId={'ID:' + index} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

VzDraggable.propTypes = {
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragUpdate: PropTypes.func,
  elements: PropTypes.array.isRequired,
};

export default VzDraggable;
