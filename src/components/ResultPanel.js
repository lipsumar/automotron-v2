import React from 'react';

function ResultPanel(props) {
  return (
    <div className="result-panel">
      {props.error ? (
        <div style={{ color: 'red' }}>
          Error node #{props.error.nodeId}:<br />
          {props.error.message}
        </div>
      ) : (
        <div className="result-panel__output">{props.output}</div>
      )}
    </div>
  );
}

export default ResultPanel;
