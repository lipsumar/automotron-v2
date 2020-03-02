import React, { useEffect } from 'react';
import GraphUiComponent from '../GraphUi';

function Editor() {
  useEffect(() => {
    document.querySelector('html').style.overflow = 'hidden';
    window.document.body.style.overflow = 'hidden';
  });
  return (
    <div className="editor">
      <div className="editor__head">Automotron</div>
      <div className="editor__body">
        <GraphUiComponent />
      </div>
    </div>
  );
}

export default Editor;
