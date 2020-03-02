import React, { useEffect, useRef } from 'react';

import GraphUi from '../ui/GraphUi';

/**
 * GraphUi is responsible for drawing a Graph
 */
function GraphUiComponent(props) {
  const graphUi = useRef(null);
  const stageRef = useRef(null);
  useEffect(() => {
    graphUi.current = new GraphUi(stageRef.current, props.graph);
  }, []);
  return <div ref={stageRef} className="graph-ui-stage"></div>;
}

export default GraphUiComponent;
