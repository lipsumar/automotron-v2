import React from 'react';
import { ContextMenu as ReactContextMenu, MenuItem } from 'react-contextmenu';

function renderItems(props) {
  if (props.subject && props.subject.from) {
    // edge
    return (
      <>
        <MenuItem data={{ foo: 'bar' }} onClick={props.onDeleteEdge}>
          Delete
        </MenuItem>
      </>
    );
  }
  if (props.subject) {
    // node
    return (
      <>
        <MenuItem data={{ foo: 'bar' }} onClick={props.onDeleteNode}>
          Delete
        </MenuItem>
      </>
    );
  }
  // stage
  return (
    <>
      <MenuItem data={{ foo: 'bar' }} onClick={props.onCreateNode}>
        New
      </MenuItem>
    </>
  );
}

export default function ContextMenu(props) {
  return (
    <ReactContextMenu id="canvas-context-menu" onHide={props.onHide}>
      {renderItems(props)}
    </ReactContextMenu>
  );
}
