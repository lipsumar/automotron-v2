import { Path, Text } from 'konva';
import NodeUi from './NodeUi';
import { measureTextHeight } from './utils';
import { GRID_SIZE } from './constants';

const padding = 10;
const arrowWidth = 6;

class TextNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 50;
    this.rect = new Path({
      data: this.getPath(),
      x: 0,
      y: 0,
      fill: '#fff',
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.2,
      // stroke: '#7791F9',
    });
    this.group.add(this.rect);

    this.text = new Text({
      text: node.value,
      x: arrowWidth,
      y: 2, // visually centered
      width: this.width,
      height: this.height,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 20,
      fontFamily: 'Open Sans',
    });
    this.group.add(this.text);

    if (opts.editable) {
      this.registerOutlet('right');
      this.group.on('dblclick', () => this.emit('edit:start'));
    }

    this.resize();
  }

  // original path (100x75)
  // 'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,47 L1,47 L7,38 L1,29 L1,4 C1,2.34314575 2.34314575,1 4,1 Z'
  getPath(width = 100, height = 75) {
    const path = ['M4,1']; // start top-left, after corner
    path.push(`L${width - 2},1`); // line to top-right
    path.push(`C${width - 0.3431},1 ${width + 1},2.34314575 ${width + 1},4`); // top-right corner
    path.push(
      `L${width + 1},${height / 2 - 8.5} L${width + 1},${height / 2 -
        8.5} L${width + arrowWidth + 1},${height / 2} L${width + 1},${height /
        2 +
        8.5} L${width + 1},${height - 2}`,
    ); // right side
    path.push(
      `C${width + 1},${height - 0.3431} ${width - 0.3431},${height +
        1} ${width - 2},${height + 1}`,
    ); // bottom-right corner
    path.push(`L4,${height + 1}`); // line to bottom left

    path.push(`C2.34314575,${height + 1} 1,${height - 0.3431} 1,${height - 2}`); // bottom-left corner
    path.push(
      `L1,${height / 2 + 8.5} L1,${height / 2 + 8.5} L${arrowWidth +
        1},${height / 2} L1,${height / 2 - 8.5} L1,4`,
    ); // left side
    path.push('C1,2.34314575 2.34314575,1 4,1'); // top-left corner
    path.push('Z'); // end

    return path.join(' ');
  }

  resize() {
    this.text.width(500);
    const textWidth = this.text.getTextWidth();
    const textHeight = measureTextHeight(this.node.value);
    const width = textWidth + padding * 2;

    this.width = width + arrowWidth + 2;
    this.height =
      Math.ceil(Math.max(50, textHeight) / GRID_SIZE) * GRID_SIZE + 2;

    this.text.width(width);
    this.text.height(this.height);
    this.rect.data(this.getPath(this.width - 2, this.height - 2));
    this.emit('resized');
  }

  outletX() {
    return this.x() + this.width;
  }

  outletY() {
    return this.y() + this.height / 2 - 1;
  }

  inletX() {
    return this.x() + arrowWidth + 2;
  }

  inletY() {
    return this.y() + this.height / 2 - 1;
  }
}

export default TextNodeUi;
