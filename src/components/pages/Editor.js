import React, { useEffect } from 'react';
import GraphUiComponent from '../GraphUi';
import Graph from '../../core/Graph';

// demo generator, as if loaded from server
const generator = {
  title: 'My awesome generator',
  graph: {
    nodes: [
      {
        id: 1,
        ui: {
          x: -50,
          y: -50,
        },
      },
    ],
    edges: [],
  },
};

const graph = Graph.fromJSON(generator.graph);

function Editor() {
  useEffect(() => {
    document.querySelector('html').style.overflow = 'hidden';
    window.document.body.style.overflow = 'hidden';
  });
  return (
    <div className="editor">
      <div className="editor__head">Automotron</div>
      <div className="editor__body">
        <GraphUiComponent graph={graph} />
      </div>
    </div>
  );
}

export default Editor;
