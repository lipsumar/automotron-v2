import React, { useEffect, useRef, useState } from 'react';

import GraphUi from '../ui/GraphUi';
import EditorUi from '../editor/EditorUi';
import TextNodeEdit from './TextNodeEdit';
/**
 * GraphUi is responsible for drawing a Graph
 */
function EditorUiComponent(props) {
  const stageRef = useRef(null);
  const [nodeEdit, setNodeEdit] = useState(false);
  const [graphBlur, setGraphBlur] = useState(false);
  useEffect(() => {
    const graphUi = new GraphUi(stageRef.current, props.graph, {
      editable: true,
    });
    graphUi.on('edit:start', uiNode => {
      setNodeEdit({
        bbox: graphUi.getNodeBoundingBox(uiNode),
        value: uiNode.node.value,
      });
      setGraphBlur(true);
    });
    graphUi.on('edit:finish', () => {
      setNodeEdit(false);
      setGraphBlur(false);
    });
    // const editor = new EditorUi(graphUi);
  }, []);
  return (
    <>
      <div
        ref={stageRef}
        className={`graph-ui-stage ${graphBlur && 'graph-ui-stage--blur'}`}
      ></div>
      {nodeEdit && <TextNodeEdit bbox={nodeEdit.bbox} value={nodeEdit.value} />}
    </>
  );
}

export default EditorUiComponent;
