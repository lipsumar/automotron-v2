import React, { useEffect, useState } from 'react';
import GraphUiComponent from '../GraphUi';
import Graph from '../../core/Graph';
import { getGenerator } from '../../client';
import EditorToolbar from '../EditorToolbar';
import ResultPanel from '../ResultPanel';
import GraphEvaluator from '../../core/GraphEvaluator';
import stringifyGraphResult from '../../core/stringifyGraphResult';

function runGenerator(generator, setResult) {
  const evaluator = new GraphEvaluator(generator.graph);
  evaluator.run().then(result => {
    setResult(stringifyGraphResult(result));
  });
}

function Editor() {
  const [generator, setGenerator] = useState();
  const [result, setResult] = useState();
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
    <div className="editor">
      <div className="editor__head">
        <EditorToolbar onRun={() => runGenerator(generator, setResult)} />
      </div>
      <div className="editor__body">
        {generator && <GraphUiComponent graph={generator.graph} />}
        <ResultPanel output={result} />
      </div>
    </div>
  );
}

export default Editor;
