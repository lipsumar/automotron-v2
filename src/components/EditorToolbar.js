import React from 'react';
import LoggedInStatus from './LoggedInStatus';

function EditorToolbar(props) {
  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar__title">Automotron</div>
      <div className="editor-toolbar__tools">
        <button onClick={props.onRun}>Run</button>
        <button onClick={props.onSave}>Save</button>
        <div className="editor-toolbar__separator"></div>
        <button onClick={props.onUndo}>Undo</button>
        <button onClick={props.onRedo}>Redo</button>
      </div>
      <div className="editor-toolbar__user">
        {props.user && (
          <LoggedInStatus user={props.user} onLogout={props.onLogout} />
        )}
      </div>
    </div>
  );
}

export default EditorToolbar;
