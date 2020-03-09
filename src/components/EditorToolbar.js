import React from 'react';

function EditorToolbar(props) {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar__title">Automotron</div>
      <div className="editor-toolbar__tools">
        <button onClick={props.onRun}>Run</button>
      </div>
    </div>
  );
}

export default EditorToolbar;
