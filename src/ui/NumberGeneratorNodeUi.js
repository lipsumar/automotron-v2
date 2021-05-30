import { Path, Text, Rect, Group, Line, Circle } from 'konva';
import { colors } from './constants';
import NodeUi from './NodeUi';
import { measureTextHeight } from './utils';

const padding = 10;
const arrowWidth = 6;

class NumberGeneratorNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 125;
    this.valuesTexts = [];
    this.valuesLines = [];
    this.agreementMarkers = [];

    this.rect = new Path({
      // data: this.getPath(),
      x: 0,
      y: 0,
      fill: colors.node,
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.2,
    });
    this.group.add(this.rect);

    this.minMaxText = new Text({
      x: 0,
      y: 17,
      width: this.width,
      fill: '#fff',
      fontSize: 20,
      align: 'center',
    });
    this.group.add(this.minMaxText);

    this.group.add(
      new Text({
        text: 'min',
        x: 12,
        y: 42,
        width: this.width,
        fill: '#fff',
        fontSize: 16,
      }),
    );
    this.group.add(
      new Text({
        text: 'max',
        x: 12,
        y: 42 + 25,
        width: this.width,
        fill: '#fff',
        fontSize: 16,
      }),
    );

    this.randomToggleText = new Text({
      x: 10,
      y: 100,
      width: this.width,
      fill: '#fff',
      fontSize: 16,
    });
    this.randomToggleText.on('click', () => {
      this.emit('setNodeOption', { field: 'isRandom', value: !node.isRandom });
    });
    this.group.add(this.randomToggleText);

    if (opts.editable) {
      // this.registerOutlet('right');
      this.registerConnector(node.flowInlet, {
        x: () => arrowWidth + 2,
        y: () => 50 / 2 - 1,
      });
      this.registerConnector(node.flowOutlet, {
        x: () => this.width,
        y: () => 50 / 2 - 1,
      });
      this.registerConnector(node.generatorOutlet, {
        x: () => this.width / 2,
        y: () => this.height,
        color: colors.generatorEdge,
      });
      this.registerConnector(node.minInlet, {
        x: () => 0,
        y: () => 50,
        color: colors.generatorEdge,
        visible: true,
      });
      this.registerConnector(node.maxInlet, {
        x: () => 0,
        y: () => 50 + 25,
        color: colors.generatorEdge,
        visible: true,
      });
      this.group.on('dblclick', e => {
        if (e.evt.button === 2) return;
        e.cancelBubble = true;
        this.emit('edit:start');
      });
    }
    this.rect.data(this.getPath(this.width, this.height));

    this.refresh();
  }

  backgroundColor() {
    return colors.specialNode;
  }

  getValueToShow() {
    return [{ text: 'n' }];
  }

  refresh() {
    this.group.clearCache();
    NodeUi.prototype.refresh.call(this);

    this.rect.fill(this.backgroundColor());

    this.minMaxText.text(`${this.node.min} → ${this.node.max}`);
    this.randomToggleText.text(`[${this.node.isRandom ? 'x' : ' '}] random`);

    this.group.cache();
    this.emit('draw');
  }

  // original path (100x75)
  // 'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,47 L1,47 L7,38 L1,29 L1,4 C1,2.34314575 2.34314575,1 4,1 Z'
  getPath(width = 100, height = 75) {
    const outletY = this.getConnector('flowOutlet').y();
    const path = ['M4,1']; // start top-left, after corner
    path.push(`L${width - 2},1`); // line to top-right
    path.push(`C${width - 0.3431},1 ${width + 1},2.34314575 ${width + 1},4`); // top-right corner
    path.push(
      `L${width + 1},${outletY - 8.5} L${width + 1},${outletY - 8.5} L${width +
        arrowWidth +
        1},${outletY} L${width + 1},${outletY + 8.5} L${width + 1},${height -
        2}`,
    ); // right side
    path.push(
      `C${width + 1},${height - 0.3431} ${width - 0.3431},${height +
        1} ${width - 2},${height + 1}`,
    ); // bottom-right corner
    path.push(`L4,${height + 1}`); // line to bottom left

    path.push(`C2.34314575,${height + 1} 1,${height - 0.3431} 1,${height - 2}`); // bottom-left corner
    path.push(
      `L1,${outletY + 8.5} L1,${outletY + 8.5} L${arrowWidth +
        1},${outletY} L1,${outletY - 8.5} L1,4`,
    ); // left side
    path.push('C1,2.34314575 2.34314575,1 4,1'); // top-left corner
    path.push('Z'); // end

    return path.join(' ');
  }
}

export default NumberGeneratorNodeUi;
