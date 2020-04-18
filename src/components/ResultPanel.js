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

      {props.count ? (
        <div className="result-panel__possibility-count">
          {props.count.toLocaleString()} possibilities
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default ResultPanel;
