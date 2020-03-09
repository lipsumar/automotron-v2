import React, { useEffect, useRef } from 'react';

import GraphUi from '../ui/GraphUi';
import EditorUi from '../editor/EditorUi';

/**
 * GraphUi is responsible for drawing a Graph
 */
function EditorUiComponent(props) {
  const stageRef = useRef(null);
  useEffect(() => {
    const graphUi = new GraphUi(stageRef.current, props.graph, {
      editable: true,
    });
    const editor = new EditorUi(graphUi);
  }, []);
  return <div ref={stageRef} className="graph-ui-stage"></div>;
}

export default EditorUiComponent;
