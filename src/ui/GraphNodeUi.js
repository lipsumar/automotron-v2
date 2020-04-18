import { Path, Text } from 'konva';
import NodeUi from './NodeUi';

const arrowWidth = 6;

class GraphNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 150;
    this.height = 100;
    this.rect = new Path({
      data: this.getPath(this.width, this.height),
      x: 0,
      y: 0,
      // width,
      // height,
      fill: '#bfd5ed',
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.2,
      strokeWidth: 3,
    });
    this.group.add(this.rect);
    this.group.add(
      new Text({
        text: 'Graph',
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 20,
        fontFamily: 'Open Sans',
      }),
    );

    if (opts.editable) {
      this.registerOutlet('left');
      this.registerOutlet('right');

      this.group.on('dblclick', e => {
        e.cancelBubble = true;
        this.emit('edit:start');
      });
    }
  }

  getPath(width = 100, height = 75) {
    const middle = this.outletY(false);
    const path = ['M4,1']; // start top-left, after corner
    path.push(`L${width - 2},1`); // line to top-right
    path.push(`C${width - 0.3431},1 ${width + 1},2.34314575 ${width + 1},4`); // top-right corner
    path.push(
      `L${width + 1},${middle - 8.5} L${width + 1},${middle - 8.5} L${width +
        arrowWidth +
        1},${middle} L${width + 1},${middle + 8.5} L${width + 1},${height - 2}`,
    ); // right side
    path.push(
      `C${width + 1},${height - 0.3431} ${width - 0.3431},${height +
        1} ${width - 2},${height + 1}`,
    ); // bottom-right corner
    path.push(`L4,${height + 1}`); // line to bottom left

    path.push(`C2.34314575,${height + 1} 1,${height - 0.3431} 1,${height - 2}`); // bottom-left corner
    path.push(
      `L1,${middle + 8.5} L1,${middle + 8.5} L${arrowWidth +
        1},${middle} L1,${middle - 8.5} L1,4`,
    ); // left side
    path.push('C1,2.34314575 2.34314575,1 4,1'); // top-left corner
    path.push('Z'); // end

    return path.join(' ');
  }

  outletX() {
    return this.x() + this.width;
  }

  outletY(absolute = true) {
    return (absolute ? this.y() : 0) + this.height / 2;
  }

  inletX() {
    return this.x() + arrowWidth + 2;
  }

  inletY() {
    return this.y() + this.height / 2 - 1;
  }

  bottomY() {
    return this.y() + this.height;
  }
}

export default GraphNodeUi;
