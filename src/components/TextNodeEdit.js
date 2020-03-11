import React, { useState, useEffect, useRef } from 'react';
import { measureTextHeight, measureTextWidth } from '../ui/utils';

function getTopLeft(bbox, size) {
  const bboxCenterX = bbox.x + bbox.width / 2;
  const bboxCenterY = bbox.y + bbox.height / 2;
  return {
    top: bboxCenterY - size.height / 2,
    left: bboxCenterX - size.width / 2,
  };
}

function TextNodeEdit(props) {
  const [size, setSize] = useState({
    width: 175,
    height: 50,
    textHeight: 20,
  });
  const [value, setValue] = useState(props.value);
  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current.focus();
  });

  useEffect(() => {
    const textWidth = measureTextWidth(value);
    const width = Math.min(Math.max(175, textWidth), 500);
    const textHeight = measureTextHeight(value, width + 6);
    setSize({
      width: width + 20,
      height: Math.max(50, textHeight + 12),
      textHeight,
    });
  }, [props.bbox, value]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div
      className="text-node-edit"
      style={{ ...getTopLeft(props.bbox, size), ...size }}
    >
      <textarea
        className={`text-node-edit__textarea ${
          size.textHeight > 20 ? '' : 'text-node-edit__textarea--single-line'
        }`}
        value={value}
        onChange={e => {
          setValue(e.target.value);
          props.onChange(e.target.value);
        }}
        ref={textareaRef}
      ></textarea>
    </div>
  );
}

export default TextNodeEdit;
