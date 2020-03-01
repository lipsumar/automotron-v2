import React, { useEffect, useRef } from 'react';

import GraphUi from '../ui/GraphUi';
/**
 * GraphUi is responsible from drawing a Graph
 */
function GraphUiComponent() {
  const graphUi = useRef(null);
  const stageRef = useRef(null);
  useEffect(() => {
    graphUi.current = new GraphUi(stageRef.current);
  }, []);
  return <div ref={stageRef} className="graph-ui-stage"></div>;
}

export default GraphUiComponent;
