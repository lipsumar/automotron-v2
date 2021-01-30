import { Path } from 'konva';
import { colors } from './constants';
import NodeUi from './NodeUi';

class StartNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 75 + 25 / 2;
    this.height = 75 + 25 / 2;
    this.rect = new Path({
      data:
        // 'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,4 C1,2.34314575 2.34314575,1 4,1 Z',
        'M38.5,76 C57.1397755,76 72.6031962,65.4004082 75.5092656,47.582221 C75.5282109,47.4660602 75.5731591,47.279484 75.6441103,47.0224924 L83,38.5 L75.6460559,30.0373749 C75.5840086,29.8058061 75.5445531,29.6372979 75.5276893,29.5318504 C72.669146,11.6576671 57.1795325,1 38.5,1 C17.7893219,1 1,17.7893219 1,38.5 C1,59.2106781 17.7893219,76 38.5,76 Z',
      x: 25 / 2,
      y: 20 / 2,
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

    if (opts.editable) {
      this.registerOutlet('default');
    }
  }

  backgroundColor() {
    return colors.startNode;
  }

  outletX() {
    return this.x() + this.width;
  }

  outletY(absolute = true) {
    return (absolute ? this.y() : 0) + 5 + this.height / 2;
  }
}

export default StartNodeUi;
