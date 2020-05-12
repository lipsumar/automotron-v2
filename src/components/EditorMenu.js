import React, { useState } from 'react';

export default function EditorMenu(props) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`editor-menu ${active ? 'editor-menu--active' : ''}`}
      onClick={() => setActive(!active)}
    >
      <div className="editor-menu__item">
        File
        <div className="editor-menu__menu">
          <div className="editor-menu__menu-item" onClick={props.onSave}>
            Save
          </div>
          <div className="editor-menu__menu-item">Create a copy</div>
          <div className="editor-menu__menu-item">Share</div>
        </div>
      </div>
      <div className="editor-menu__item">
        Edit
        <div className="editor-menu__menu">
          <div className="editor-menu__menu-item" onClick={props.onUndo}>
            Undo
          </div>
          <div className="editor-menu__menu-item" onClick={props.onRedo}>
            Redo
          </div>
          <div className="editor-menu__menu-separator"></div>
          <div className="editor-menu__menu-item">Copy</div>
          <div className="editor-menu__menu-item">Paste</div>
        </div>
      </div>
      <div className="editor-menu__item">
        Insert
        <div className="editor-menu__menu">
          <div className="editor-menu__menu-item" onClick={props.onInsertText}>
            Text
          </div>
        </div>
      </div>
      <div className="editor-menu__item">
        Export
        <div className="editor-menu__menu">
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('text')}
          >
            As text
          </div>
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('html')}
          >
            As HTML
          </div>
        </div>
      </div>
      <div className="editor-menu__item">Help</div>
    </div>
  );
}
