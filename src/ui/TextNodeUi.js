import { Path, Text } from 'konva';
import NodeUi from './NodeUi';

class TextNodeUi extends NodeUi {
  constructor(opts) {
    super(opts);
    const width = 100;
    const height = 75;
    this.group.add(
      new Path({
        data:
          'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,47 L1,47 L7,38 L1,29 L1,4 C1,2.34314575 2.34314575,1 4,1 Z',
        x: 0,
        y: 0,
        // width,
        // height,
        fill: '#fff',
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.2,
        // stroke: '#7791F9',
      }),
    );
    this.group.add(
      new Text({
        text: 'Start',
        x: 0,
        y: 0,
        width,
        height,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 20,
        fontFamily: 'Open Sans',
      }),
    );
  }

  outletX() {
    return this.x() + 100;
  }

  outletY() {
    return this.y() + 75 / 2;
  }

  inletX() {
    return this.x() + 8;
  }

  inletY() {
    return this.y() + 75 / 2;
  }
}

export default TextNodeUi;
