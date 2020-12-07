import React from 'react';
import { useTranslation } from 'react-i18next';

function ResultPanel(props) {
  const { t } = useTranslation();
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
          {props.count.toLocaleString()} {t('editor.sidebar.possibilities')}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default ResultPanel;
