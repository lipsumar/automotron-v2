import { Path, Text, Rect, Group, Line } from 'konva';
import NodeUi from './NodeUi';
import { measureTextHeight, measureTextWidth } from './utils';
import { GRID_SIZE } from './constants';

const padding = 10;
const arrowWidth = 6;

class TextListNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 50;
    this.valuesTexts = [];
    this.valuesLines = [];

    this.titleGroup = new Group({
      y: -14,
      x: 1,
    });
    this.group.add(this.titleGroup);
    this.titleRect = new Rect({
      fill: '#F3D31C',
      cornerRadius: 3,
      height: 17,
      // width: 25,
    });
    this.titleGroup.add(this.titleRect);
    this.titleText = new Text({
      // text: 'label',
      fontSize: 12,
      y: 2,
      x: 3,
      opacity: 0.6,
    });
    this.titleGroup.add(this.titleText);

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

    this.listGroup = new Group({});
    this.group.add(this.listGroup);
    this.listRect = new Rect({
      x: 1,
      y: 0,
      width: this.width,
    });
    this.listGroup.add(this.listRect);

    if (opts.editable) {
      this.registerOutlet('right');
      this.group.on('dblclick', e => {
        e.cancelBubble = true;
        this.emit('edit:start');
      });
    }

    this.refresh();
  }

  refresh() {
    NodeUi.prototype.refresh.call(this);

    this.rect.fill(this.isGenerated() ? '#e5d4f5' : '#fff');

    this.titleGroup.visible(!!this.node.title);
    if (this.node.title) {
      this.titleText.text(this.node.title);
      this.titleRect.width(measureTextWidth(this.node.title, 12) + 4);
    }

    this.resize();
    this.emit('draw');
  }

  isMulti() {
    if (this.isGenerated()) {
      return false;
    }
    return this.node.value.length > 1;
  }

  // original path (100x75)
  // 'M4,1 L98,1 C99.6568542,1 101,2.34314575 101,4 L101,29 L101,29 L107,38 L101,47 L101,73 C101,74.6568542 99.6568542,76 98,76 L4,76 C2.34314575,76 1,74.6568542 1,73 L1,47 L1,47 L7,38 L1,29 L1,4 C1,2.34314575 2.34314575,1 4,1 Z'
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

  resize() {
    const valuesSize = this.resizeValues(50 - arrowWidth);

    this.width = valuesSize.width + arrowWidth + 2;
    this.height = Math.max(52, valuesSize.height);

    this.listRect.width(this.width - 2);
    this.listGroup.y(this.isMulti() ? 0 : 2);

    this.rect.data(this.getPath(this.width - 2, this.height - 2));

    this.emit('resized');
    this.emit('moved');
  }

  getValueToShow() {
    if (this.isGenerated()) {
      return [this.node.ui.generatorValue];
    }
    return this.node.value;
  }

  isGenerated() {
    return !!this.node.ui.generatorValue;
  }

  resizeValues(minWidth) {
    this.valuesTexts.forEach(text => text.destroy());
    this.valuesLines.forEach(line => line.destroy());
    this.valuesTexts = [];
    this.valuesLines = [];
    const sizes = [];
    let y = padding / 2;

    this.getValueToShow().forEach(value => {
      const text = new Text({
        text: value,
        x: arrowWidth,
        y,
        width: 500,
        height: 25,
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 20,
        fontFamily: 'Open Sans',
        fontStyle: this.isGenerated() ? 'italic' : 'normal',
      });

      this.listGroup.add(text);
      this.valuesTexts.push(text);

      const textWidth = text.getTextWidth();
      const textHeight = measureTextHeight(value);
      const width = textWidth + padding * 2;

      const height = textHeight + padding * 2;
      text.height(height);
      sizes.push({ width, height });

      y += height;
    });

    const largest = Math.max(minWidth, ...sizes.map(size => size.width));
    let height = padding / 2 - 2;
    sizes.forEach((size, i) => {
      this.valuesTexts[i].width(largest);

      if (i > 0) {
        const line = new Line({
          points: [arrowWidth + 4, height, largest + 2, height],
          stroke: '#d7e2ee',
        });
        this.valuesLines.push(line);
        this.listGroup.add(line);
      }
      height += size.height;
    });
    height += padding / 2;
    this.listRect.height(height);
    return { width: largest, height };
  }

  outletX() {
    return this.x() + this.width;
  }

  outletY(absolute = true) {
    return (absolute ? this.y() : 0) + 50 / 2 - 1;
  }

  inletX() {
    return this.x() + arrowWidth + 2;
  }

  inletY() {
    return this.y() + 50 / 2 - 1;
  }
}

export default TextListNodeUi;
