import React, { createRef } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { measureTextHeight, measureTextWidth } from '../ui/utils';
import parseRawText from '../ui/parseRawText';

const DEFAULT_SIZE = {
  width: 175,
  height: 50,
  textHeight: 20,
};

function getTopLeft(bbox, size) {
  const bboxCenterX = bbox.x + bbox.width / 2;
  const bboxCenterY = bbox.y + bbox.height / 2;
  return {
    top: bboxCenterY - size.height / 2,
    left: bboxCenterX - size.width / 2,
  };
}

class TextNodeEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value.map(val => {
        return { ...val, rawText: val.rawText || val.text };
      }),
      size: props.value.map(() => {
        return { ...DEFAULT_SIZE };
      }),
    };
    this.focusRef = createRef();
    this.linesParentRef = createRef();
  }

  componentDidMount() {
    const size = [];
    const dimensions = this.state.value.map(val => {
      return this.measure(val);
    });
    this.widths = dimensions.map(d => d.width);
    this.heights = dimensions.map(d => d.textHeight);
    this.setState({ size });

    this.state.value.forEach((val, i) => {
      this.resize(val, i);
    });

    this.focusRef.current.focus();
  }

  setOneValue(rawText, index, cb) {
    const value = cloneDeep(this.state.value);
    value[index] = parseRawText(rawText);
    value[index].rawText = rawText;
    this.setState({ value }, cb);
    this.resize(value[index], index);
  }

  measure(val) {
    const textWidth = measureTextWidth(val.text);
    const width = Math.min(Math.max(175, textWidth), 500);
    const textHeight = measureTextHeight(val.text, width + 6);
    return { width, textHeight };
  }

  resize(val, index) {
    const { width, textHeight } = this.measure(val);
    this.widths[index] = width;
    const height = Math.max(50, textHeight + 12);
    this.heights[index] = height;
    const size = [...this.state.size];

    size[index] = {
      height,
      textHeight,
    };
    this.setState({
      width: Math.max(...this.widths) + 20,
      size,
      fullSize: {
        width: Math.max(...this.widths) + 20,
        height: this.heights.reduce((acc, h) => acc + h, 0),
      },
    });
  }

  addValue(index) {
    const value = [...this.state.value];
    value.splice(index, 0, '');
    const size = [...this.state.size];
    size.splice(index, 0, { ...DEFAULT_SIZE });
    const dimensions = this.measure('');
    this.widths.splice(index, 0, dimensions.width);
    this.heights.splice(index, 0, dimensions.textHeight);
    return new Promise(resolve => {
      this.setState({ value, size }, () => {
        this.resize('', index);
        resolve();
      });
    });
  }

  onKeyDown(e, index) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.addValue(index).then(() => {
        this.focusIndex(index);
      });
    }
  }

  focusIndex(index) {
    this.linesParentRef.current.children[index]
      .querySelector('textarea')
      .focus();
  }

  render() {
    return (
      <div
        className={`text-node-edit ${
          this.state.value.length > 1 ? 'text-node-edit--multi' : ''
        }`}
        style={
          this.state.fullSize
            ? getTopLeft(this.props.bbox, this.state.fullSize)
            : {}
        }
        ref={this.linesParentRef}
      >
        {this.state.value.map((oneValue, i) => {
          return (
            <div
              className="text-node-edit__line"
              style={{ ...this.state.size[i], width: this.state.width }}
              key={i}
            >
              <textarea
                ref={i === 0 ? this.focusRef : null}
                className={`text-node-edit__textarea ${
                  this.state.size[i].textHeight > 20
                    ? ''
                    : 'text-node-edit__textarea--single-line'
                }`}
                value={oneValue.rawText}
                onChange={e => {
                  this.setOneValue(e.target.value, i, () => {
                    const cleanedValues = this.state.value.filter(
                      v => v.text.trim() !== '',
                    );
                    this.props.onChange(
                      cleanedValues.length > 0 ? cleanedValues : [{ text: '' }],
                    );
                  });
                }}
                onKeyDown={e => this.onKeyDown(e, i + 1)}
              ></textarea>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TextNodeEdit;
