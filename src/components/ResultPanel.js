import React from 'react';

function ResultPanel(props) {
  return (
    <div className="result-panel">
      <div>{props.output}</div>
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
