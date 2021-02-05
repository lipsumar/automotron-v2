import { Path, Text } from 'konva';

import { colors } from './constants';
import NodeUi from './NodeUi';

const padding = 10;
const arrowWidth = 6;

class LoopNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 75;
    this.height = 125;
    this.rect = new Path({
      // data: this.getPath(this.width, this.height),
      x: 0,
      y: 0,
      // width,
      // height,
      fill: this.backgroundColor(),
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.2,
      strokeWidth: 3,
    });
    this.group.add(this.rect);

    this.loopText = new Text({
      text: `${this.maxCount()}x`,
      x: 0,
      y: 17,
      width: this.width,
      fill: '#fff',
      fontSize: 20,
      align: 'center',
    });
    this.group.add(this.loopText);

    if (opts.editable) {
      this.registerConnector(node.flowInlet, {
        x: () => arrowWidth + 2,
        y: () => 50 / 2 - 1,
      });
      this.registerConnector(node.loopOutlet, {
        x: () => this.width,
        y: () => 50 / 2 - 1,
      });
      this.registerConnector(node.exitOutlet, {
        x: () => this.width,
        y: () => 50 / 2 - 1 + 75,
      });

      this.group.on('dblclick', e => {
        if (e.evt.button === 2) return;
        e.cancelBubble = true;
        this.emit('edit:start');
      });
    }
    this.rect.data(this.getPath(this.width, this.height));
  }

  backgroundColor() {
    return colors.loopNode;
  }

  isGenerated() {
    return !!this.node.ui.generatorValue;
  }

  maxCount() {
    if (this.isGenerated()) {
      return this.node.ui.generatorValue.text;
    }
    return this.node.value[0].text;
  }

  refresh() {
    this.group.clearCache();
    NodeUi.prototype.refresh.call(this);

    this.loopText.text(`${this.maxCount()}x`);

    this.group.cache();
  }

  // original path (100x75)
  // 'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,47 L1,47 L7,38 L1,29 L1,4 C1,2.34314575 2.34314575,1 4,1 Z'
  getPath(width = 100, height = 75) {
    const defaultOutletY = this.getConnector('loopOutlet').y();
    const exitOutletY = this.getConnector('exitOutlet').y();
    const path = ['M4,1']; // start top-left, after corner
    path.push(`L${width - 2},1`); // line to top-right
    path.push(`C${width - 0.3431},1 ${width + 1},2.34314575 ${width + 1},4`); // top-right corner
    path.push(`
      L${width + 1},${defaultOutletY - 8.5} 
      L${width + 1},${defaultOutletY - 8.5} 
      L${width + arrowWidth + 1},${defaultOutletY} 
      L${width + 1},${defaultOutletY + 8.5} 
      L${width + 1}, ${exitOutletY - 8.5}
      L${width + arrowWidth + 1},${exitOutletY} 
      L${width + 1}, ${exitOutletY + 8.5}
      L${width + 1},${height - 2}
    `); // right side
    path.push(
      `C${width + 1},${height - 0.3431} ${width - 0.3431},${height +
        1} ${width - 2},${height + 1}`,
    ); // bottom-right corner
    path.push(`L4,${height + 1}`); // line to bottom left

    path.push(`C2.34314575,${height + 1} 1,${height - 0.3431} 1,${height - 2}`); // bottom-left corner
    path.push(
      `L1,${defaultOutletY + 8.5} L1,${defaultOutletY + 8.5} L${arrowWidth +
        1},${defaultOutletY} L1,${defaultOutletY - 8.5} L1,4`,
    ); // left side
    path.push('C1,2.34314575 2.34314575,1 4,1'); // top-left corner
    path.push('Z'); // end

    return path.join(' ');
  }
}

export default LoopNodeUi;
