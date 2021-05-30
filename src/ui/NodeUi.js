import { Group, Circle } from 'konva';
import { EventEmitter } from 'events';
import { colors, GRID_SIZE } from './constants';
import { clampValue } from './utils';
import ConnectorUi from './ConnectorUi';

class NodeUi extends EventEmitter {
  group = null;

  outlets = {};

  constructor(node, opts = {}) {
    super();
    this.node = node;
    this.connectors = [];
    this.group = new Group({
      x: node.ui.x,
      y: node.ui.y,
      draggable: opts.editable,
    });

    if (opts.editable) {
      this.outletDragging = false;
      this.group.on('dragstart', () => {
        this.dragStartedAt = {
          x: this.x(),
          y: this.y(),
        };
        this.emit('drag:start');
      });
      this.group.on('dragend', () => {
        this.snapToGrid();
        this.emit('drag:finish');
      });
      this.group.on('dragmove', () => {
        if (!this.outletDragging) {
          this.emit('moved');
          this.emit('drag:move');
        }
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

  registerConnector(connector, options) {
    let connectorUi = null;

    connectorUi = new ConnectorUi(connector, this, options);
    if (connector.direction === 'out' || connector.direction === 'in-out') {
      connectorUi.outlet = this.createOutlet(connectorUi);
      this.group.add(connectorUi.outlet);
    }
    if (connector.direction === 'in' && connectorUi.visible) {
      connectorUi.inlet = this.createInlet(connectorUi);
      this.group.add(connectorUi.inlet);
    }

    this.connectors.push(connectorUi);
    this.positionOutlets();
    return connectorUi;
  }

  getConnector(key) {
    return this.connectors.find(
      connectorUi => connectorUi.connector.key === key,
    );
  }

  // @deprecated
  registerOutlet(side) {
    const outlet = this.createOutlet();
    this.outlets[side] = outlet;
    this.group.add(outlet);
    this.positionOutlets();
  }

  createOutlet(connectorUi) {
    const circle = new Circle({
      radius: 7,
      fill: connectorUi.color || colors.nodeOutlet,
      stroke: colors.nodeOutletOutline,
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
      this.outletDragging = true;
      circle.opacity(0);
      this.emit('newEdgeToMouse:start', { fromConnectorUi: connectorUi });
    });
    circle.on('dragmove', () => {
      this.emit('newEdgeToMouse:move', { fromConnectorUi: connectorUi });
    });
    circle.on('dragend', e => {
      e.cancelBubble = true;
      this.positionOutlets();
      this.emit('newEdgeToMouse:finish', { fromConnectorUi: connectorUi });
      this.emit('draw');
      this.outletDragging = false;
    });
    return circle;
  }

  createInlet(connectorUi) {
    const circle = new Circle({
      radius: 7,
      fill: connectorUi.color || colors.nodeOutlet,
      stroke: colors.nodeOutletOutline,
      opacity: 1,
      draggable: false,
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
    this.getOutConnectors().forEach(connectorUi => {
      connectorUi.outlet.position({
        x: connectorUi.x(),
        y: connectorUi.y(),
      });
    });
    this.getOptionInlets().forEach(connectorUi => {
      connectorUi.inlet.position({
        x: connectorUi.x(),
        y: connectorUi.y(),
      });
    });
  }

  getOutConnectors() {
    return this.connectors.filter(
      connectorUi =>
        connectorUi.connector.direction === 'out' ||
        connectorUi.connector.direction === 'in-out',
    );
  }

  getOptionInlets() {
    return this.connectors.filter(
      connectorUi =>
        connectorUi.connector.direction === 'in' && connectorUi.visible,
    );
  }

  getInletsOfType(type) {
    return this.connectors.filter(
      connectorUi =>
        (connectorUi.connector.direction === 'in' ||
          connectorUi.connector.direction === 'in-out') &&
        connectorUi.connector.type === type,
    );
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
