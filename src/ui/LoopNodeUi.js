import { Path, Text } from 'konva';

import { colors } from './constants';
import NodeUi from './NodeUi';

const padding = 10;
const arrowWidth = 6;

class LoopNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 125;
    this.rect = new Path({
      data: this.getPath(this.width, this.height),
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
      this.registerOutlet('default');
      this.registerOutlet('exit');
      this.group.on('dblclick', e => {
        if (e.evt.button === 2) return;
        e.cancelBubble = true;
        this.emit('edit:start');
      });
    }
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
    return this.node.maxCount();
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
    const defaultOutletY = this.outletY(false);
    const exitOutletY = this.outletY(false, 'exit');
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

  outletX() {
    return this.x() + this.width;
  }

  outletY(absolute = true, type = 'default') {
    if (type === 'exit') {
      return (absolute ? this.y() : 0) + 100 - 1;
    }
    return (absolute ? this.y() : 0) + 25 - 1;
  }

  inletX() {
    return this.x() + arrowWidth + 2;
  }

  inletY() {
    let y = this.y() + 50 / 2 - 1;
    if (this.node.title) {
      y += 25;
    }
    return y;
  }

  bottomY() {
    return this.y() + this.height;
  }
}

export default LoopNodeUi;
