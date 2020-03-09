import { Path, Text } from 'konva';
import NodeUi from './NodeUi';

class StartNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 75;
    this.group.add(
      new Path({
        data:
          'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,4 C1,2.34314575 2.34314575,1 4,1 Z',
        x: 0,
        y: 0,
        // width,
        // height,
        fill: '#91fbcf',
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.2,
      }),
    );
    this.group.add(
      new Text({
        text: 'Start',
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
      this.registerOutlet('right');
    }
  }

  outletX() {
    return this.x() + 100;
  }

  outletY() {
    return this.y() + 75 / 2;
  }
}

export default StartNodeUi;
