import React, { useEffect, useState } from 'react';
import { getGenerator } from '../../client';
import Graph from '../../core/Graph';
import GraphUiComponent from '../GraphUi';

function View() {
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
  }, []);

  return (
    <div className="view">
      {generator && <GraphUiComponent graph={generator.graph} />}
    </div>
  );
}

export default View;
