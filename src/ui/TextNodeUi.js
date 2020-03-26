import { Path, Text, Rect, Group, Line } from 'konva';
import NodeUi from './NodeUi';
import { measureTextHeight } from './utils';
import { GRID_SIZE } from './constants';

const padding = 10;
const arrowWidth = 6;

class TextListNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 50;
    this.titleHeight = 50;
    this.valuesTexts = [];
    this.valuesLines = [];
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

    this.titleText = new Text({
      x: arrowWidth,
      y: 2, // visually centered
      width: this.width,
      height: this.titleHeight,
      align: 'center',
      verticalAlign: 'middle',
      fontSize: 20,
      fontFamily: 'Open Sans',
    });
    this.group.add(this.titleText);

    this.listGroup = new Group({});
    this.group.add(this.listGroup);
    this.listRect = new Rect({
      x: 1,
      y: 0,
      width: this.width,
      fill: '#d7e2ee',
      // opacity: 0.7,
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
    if (this.isMulti() && this.node.title) {
      this.titleText.text(this.node.title);
      this.titleText.fontStyle('italic');
      this.listRect.visible(true);
    } else if (this.isMulti() && !this.node.title) {
      this.titleText.visible(false);
    } else if (!this.isMulti()) {
      this.titleText.text(this.node.value[0]);
      this.titleText.fontStyle('normal');
      this.listRect.visible(false);
    }

    this.resize();
    this.emit('draw');
  }

  isMulti() {
    return this.node.value.length > 1;
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
    let width = 0;

    if ((this.isMulti() && this.node.title) || !this.isMulti()) {
      // calculate title width & height
      this.titleText.width(500);
      const textWidth = this.titleText.getTextWidth();
      const textHeight = measureTextHeight(this.titleText.text());
      width = textWidth + padding * 2;

      this.width = width + arrowWidth + 2;
      const titleHeight =
        Math.ceil(Math.max(50, textHeight) / GRID_SIZE) * GRID_SIZE + 2;
      this.height = titleHeight;
      this.titleHeight = titleHeight;
      this.titleText.width(width);
      this.titleText.height(this.height);
      this.listGroup.y(this.height);
    } else {
      this.height = 0;
      this.listGroup.y(0);
      this.listRect.visible(false);
    }

    if (this.isMulti()) {
      // calculate values width & height
      const valuesSize = this.resizeValues(width);

      if (valuesSize.width > width) {
        this.width = valuesSize.width + arrowWidth + 2;
        this.titleText.width(valuesSize.width);
      }
      this.height += valuesSize.height;

      this.listRect.width(this.width - 2);
    }

    this.rect.data(
      this.getPath(
        this.width - 2,
        this.isMulti() && this.node.title
          ? this.titleHeight - 2
          : this.height - 2,
      ),
    );

    this.emit('resized');
    this.emit('moved');
  }

  resizeValues(minWidth) {
    this.valuesTexts.forEach(text => text.destroy());
    this.valuesLines.forEach(line => line.destroy());
    this.valuesTexts = [];
    this.valuesLines = [];
    const sizes = [];
    let y = padding / 2;
    this.node.value.forEach(value => {
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
      });

      this.listGroup.add(text);
      this.valuesTexts.push(text);

      const textWidth = text.getTextWidth();
      const textHeight = measureTextHeight(value);
      const width = textWidth + padding * 2;

      const height =
        textHeight +
        (this.isMulti() && !this.node.title ? padding * 2 : padding);
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
    if (this.isMulti() && !this.node.title) {
      return (absolute ? this.y() : 0) + this.height / 2 - 1;
    }

    return (absolute ? this.y() : 0) + this.titleHeight / 2 - 1;
  }

  inletX() {
    return this.x() + arrowWidth + 2;
  }

  inletY() {
    if (this.isMulti() && !this.node.title) {
      return this.y() + this.height / 2 - 1;
    }
    return this.y() + this.titleHeight / 2 - 1;
  }
}

export default TextListNodeUi;
