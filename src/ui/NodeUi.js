import { Group } from 'konva';
import { EventEmitter } from 'events';
import { GRID_SIZE } from './constants';

class NodeUi extends EventEmitter {
  group = null;

  constructor(node) {
    super();
    this.node = node;
    this.group = new Group({
      x: node.ui.x,
      y: node.ui.y,
      draggable: true,
    });
    this.group.on('dragend', () => {
      this.snapToGrid();
    });
    this.group.on('dragmove', () => {
      this.emit('moved');
    });
  }

  snapToGrid() {
    this.group.position({
      x: Math.round(this.group.x() / GRID_SIZE) * GRID_SIZE - 1,
      y: Math.round(this.group.y() / GRID_SIZE) * GRID_SIZE - 1,
    });
    this.emit('draw');
    this.emit('moved');
  }

  x() {
    return this.group.x();
  }

  y() {
    return this.group.y();
  }
}

export default NodeUi;
