import { Group, Circle } from 'konva';
import { EventEmitter } from 'events';
import { colors, GRID_SIZE } from './constants';
import { clampValue } from './utils';

class NodeUi extends EventEmitter {
  group = null;

  outlets = {};

  constructor(node, opts = {}) {
    super();
    this.node = node;
    this.group = new Group({
      x: node.ui.x,
      y: node.ui.y,
      draggable: opts.editable,
    });

    if (opts.editable) {
      this.group.on('dragstart', () => {
        this.dragStartedAt = {
          x: this.x(),
          y: this.y(),
        };
      });
      this.group.on('dragend', () => {
        this.snapToGrid();
        this.emit('drag:finish');
      });
      this.group.on('dragmove', () => {
        this.emit('moved');
        this.emit('drag:move');
      });
      this.group.on('mousedown', e => {
        if (e.evt.button === 2) {
          this.emit('contextmenu');
        }
      });
      this.group.on('click', e => {
        this.emit('click', e);
      });
      this.on('resized', this.positionOutlets.bind(this));
    }
  }

  destroy() {
    this.group.destroy();
  }

  refresh() {
    this.group.x(this.node.ui.x);
    this.group.y(this.node.ui.y);
    this.emit('moved');
  }

  setError(error) {
    if (error) {
      this.rect.fill('red');
    } else {
      this.rect.fill(this.backgroundColor());
    }

    this.draw();
  }

  draw() {
    this.group.clearCache();
    this.emit('draw');
    this.group.cache();
  }

  registerOutlet(side) {
    const outlet = this.createOutlet();
    this.outlets[side] = outlet;
    this.group.add(outlet);
    this.positionOutlets();
  }

  createOutlet(opts) {
    const circle = new Circle({
      radius: 7,
      fill: colors.nodeOutlet,
      stroke: colors.nodeOutletOutline,
      ...opts,
      opacity: 0,
      draggable: true,
    });
    circle.on('mouseenter', () => {
      this.group.clearCache();
      circle.opacity(1);
      this.emit('draw');
      this.group.cache();
    });
    circle.on('mouseleave', () => {
      this.group.clearCache();
      circle.opacity(0);
      this.emit('draw');
      this.group.cache();
    });
    circle.on('dragstart', () => {
      circle.opacity(0);
      this.emit('newEdgeToMouse:start', this);
    });
    circle.on('dragmove', () => {
      this.emit('newEdgeToMouse:move');
    });
    circle.on('dragend', e => {
      e.cancelBubble = true;
      this.positionOutlets();
      this.emit('newEdgeToMouse:finish');
      this.emit('draw');
    });
    return circle;
  }

  setSelected(selected) {
    this.selected = selected;
    if (selected) {
      this.rect.stroke(colors.userSelection);
    } else {
      this.rect.stroke('transparent');
    }
    this.draw();
  }

  getOutletPos() {
    return { x: this.width + 2, y: this.outletY(false) };
  }

  positionOutlets() {
    Object.keys(this.outlets).forEach(side => {
      this.outlets[side].position(this.getOutletPos());
    });
  }

  snapToGrid() {
    this.group.position({
      x: clampValue(this.group.x(), GRID_SIZE) - 1,
      y: clampValue(this.group.y(), GRID_SIZE) - 1,
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

  centerX() {
    return this.x() + this.width / 2;
  }

  centerY() {
    return this.y() + this.height / 2;
  }

  isNode() {
    return true;
  }

  move(pos) {
    this.group.x(pos.x);
    this.group.y(pos.y);
    this.emit('moved');
  }
}

export default NodeUi;
