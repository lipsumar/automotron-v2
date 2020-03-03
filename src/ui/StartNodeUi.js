import { Rect, Text } from 'konva';
import NodeUi from './NodeUi';

class StartNodeUi extends NodeUi {
  constructor(opts) {
    super(opts);
    const width = 100;
    const height = 75;
    this.group.add(
      new Rect({
        x: 0,
        y: 0,
        width,
        height,
        fill: '#91fbcf',
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0.2,
        cornerRadius: 3,
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
}

export default StartNodeUi;
