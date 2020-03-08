import React, { useEffect, useState } from 'react';
import GraphUiComponent from '../GraphUi';
import Graph from '../../core/Graph';
import { getGenerator } from '../../client';

function Editor() {
  const [generator, setGenerator] = useState();
  useEffect(() => {
    document.querySelector('html').style.overflow = 'hidden';
    window.document.body.style.overflow = 'hidden';
    getGenerator().then(generatorData => {
      setGenerator({
        ...generatorData,
        ...{ graph: Graph.fromJSON(generatorData.graph) },
      });
    });
  });
  return (
    <div className="editor">
      <div className="editor__head">Automotron</div>
      <div className="editor__body">
        {generator && <GraphUiComponent graph={generator.graph} />}
      </div>
    </div>
  );
}

export default Editor;
