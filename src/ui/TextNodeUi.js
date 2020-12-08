import { Path, Text, Rect, Group, Line, Circle } from 'konva';
import { colors } from './constants';
import NodeUi from './NodeUi';
import { measureTextHeight } from './utils';

const padding = 10;
const arrowWidth = 6;

class TextListNodeUi extends NodeUi {
  constructor(node, opts) {
    super(node, opts);
    this.width = 100;
    this.height = 50;
    this.valuesTexts = [];
    this.valuesLines = [];
    this.agreementMarkers = [];

    this.rect = new Path({
      data: this.getPath(),
      x: 0,
      y: 0,
      fill: colors.node,
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.2,
    });
    this.group.add(this.rect);

    this.listGroup = new Group({});
    this.group.add(this.listGroup);

    this.titleGroup = new Group({
      y: 1,
      x: 1,
    });
    this.group.add(this.titleGroup);
    this.titleRect = new Rect({
      fill: colors.nodeTitle,
      cornerRadius: 3,
      height: 25,
      width: this.width,
      shadowColor: 'black',
      shadowBlur: 5,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0.2,
    });
    this.titleGroup.add(this.titleRect);
    this.titleRectBottom = new Rect({
      x: 0,
      y: 20,
      height: 8,
      width: this.width,
      fill: colors.nodeTitle,
    });
    this.titleGroup.add(this.titleRectBottom);
    this.titleText = new Text({
      fontSize: 18,
      y: 5,
      x: padding,
      width: this.width,
      fill: colors.nodeTitleText,
    });
    this.titleGroup.add(this.titleText);

    if (opts.editable) {
      this.registerOutlet('right');
      this.group.on('dblclick', e => {
        e.cancelBubble = true;
        this.emit('edit:start');
      });
    }

    this.refresh();
  }

  backgroundColor() {
    return this.isGenerated() ? colors.nodeGenerated : colors.node;
  }

  refresh() {
    this.group.clearCache();
    NodeUi.prototype.refresh.call(this);

    this.rect.fill(this.backgroundColor());

    this.titleGroup.visible(!!this.node.title);
    if (this.node.title) {
      this.titleText.text(this.node.title);
    }

    // temporary, does not look great
    if (this.node.frozen) {
      this.rect.shadowColor('blue');
      this.rect.shadowOpacity(0.6);
      this.rect.shadowBlur(12);
    } else {
      this.rect.shadowColor('black');
      this.rect.shadowOpacity(0.2);
      this.rect.shadowBlur(5);
    }

    this.resize();
    this.group.cache();
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
    const outletY = this.outletY(false);
    const path = ['M4,1']; // start top-left, after corner
    path.push(`L${width - 2},1`); // line to top-right
    path.push(`C${width - 0.3431},1 ${width + 1},2.34314575 ${width + 1},4`); // top-right corner
    path.push(
      `L${width + 1},${outletY - 8.5} L${width + 1},${outletY - 8.5} L${width +
        arrowWidth +
        1},${outletY} L${width + 1},${outletY + 8.5} L${width + 1},${height -
        2}`,
    ); // right side
    path.push(
      `C${width + 1},${height - 0.3431} ${width - 0.3431},${height +
        1} ${width - 2},${height + 1}`,
    ); // bottom-right corner
    path.push(`L4,${height + 1}`); // line to bottom left

    path.push(`C2.34314575,${height + 1} 1,${height - 0.3431} 1,${height - 2}`); // bottom-left corner
    path.push(
      `L1,${outletY + 8.5} L1,${outletY + 8.5} L${arrowWidth +
        1},${outletY} L1,${outletY - 8.5} L1,4`,
    ); // left side
    path.push('C1,2.34314575 2.34314575,1 4,1'); // top-left corner
    path.push('Z'); // end

    return path.join(' ');
  }

  resize() {
    const valuesSize = this.resizeValues(50 - arrowWidth);

    this.width = valuesSize.width + arrowWidth;
    this.height = Math.max(52, valuesSize.height - 5);

    this.listGroup.y(this.isMulti() ? 0 : 2);

    this.rect.data(this.getPath(this.width, this.height));

    this.titleRect.width(this.width);
    this.titleRectBottom.width(this.width);

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
    this.agreementMarkers.forEach(marker => marker.destroy());
    this.valuesTexts = [];
    this.valuesLines = [];
    const sizes = [];
    let y = padding / 2;

    if (this.node.title) {
      y += 20;
    }

    this.getValueToShow().forEach(value => {
      const text = new Text({
        text: value.text,
        x: arrowWidth + padding,
        y,
        width: 500,
        height: 25,
        align: 'left',
        verticalAlign: 'middle',
        fontSize: 20,
        fontFamily: 'Open Sans',
        fontStyle: this.isGenerated() ? 'italic' : 'normal',
      });

      this.listGroup.add(text);
      this.valuesTexts.push(text);

      const textWidth = text.getTextWidth();
      const textHeight = measureTextHeight(value.text);

      let agreementMarkerWidth = 0;
      if (value.agreement) {
        const marker = new Circle({
          x: text.x() + textWidth + 8,
          y: y + 19,
          radius: 3,
          fill: colors.agreementMarker,
        });
        this.agreementMarkers.push(marker);
        this.listGroup.add(marker);
        agreementMarkerWidth = 10;
      }

      const width = textWidth + padding * 2 + agreementMarkerWidth;

      const height = textHeight + padding * 2;
      text.height(height);
      sizes.push({ width, height });

      y += height;
    });

    const largest = Math.max(minWidth, ...sizes.map(size => size.width));
    let height = padding / 2;
    if (this.node.title) {
      height += 20;
    }

    sizes.forEach((size, i) => {
      this.valuesTexts[i].width(largest);

      if (i > 0) {
        const line = new Line({
          points: [
            arrowWidth + padding - 2,
            height,
            largest - padding / 2,
            height,
          ],
          stroke: colors.nodeMultiValueSeparator,
        });
        this.valuesLines.push(line);
        this.listGroup.add(line);
      }
      height += size.height;
    });
    height += padding / 2;
    return { width: largest, height };
  }

  outletX() {
    return this.x() + this.width;
  }

  outletY(absolute = true) {
    let y = (absolute ? this.y() : 0) + 50 / 2 - 1;
    if (this.node.title) {
      y += 20;
    }
    return y;
  }

  inletX() {
    return this.x() + arrowWidth + 2;
  }

  inletY() {
    let y = this.y() + 50 / 2 - 1;
    if (this.node.title) {
      y += 20;
    }
    return y;
  }

  bottomY() {
    return this.y() + this.height;
  }
}

export default TextListNodeUi;
