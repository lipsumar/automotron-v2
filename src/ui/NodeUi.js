import { Group } from 'konva';
import { EventEmitter } from 'events';
import { GRID_SIZE } from './constants';

class NodeUi extends EventEmitter {
  group = null;

  constructor(opts) {
    super();
    this.group = new Group({
      x: opts.pos.x,
      y: opts.pos.y,
      draggable: true,
    });
    this.group.on('dragend', () => {
      this.group.position({
        x: Math.round(this.group.x() / GRID_SIZE) * GRID_SIZE - 1,
        y: Math.round(this.group.y() / GRID_SIZE) * GRID_SIZE - 1,
      });
      this.emit('draw');
    });
  }
}

export default NodeUi;
