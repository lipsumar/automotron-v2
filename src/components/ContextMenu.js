import React from 'react';
import { ContextMenu as ReactContextMenu, MenuItem } from 'react-contextmenu';

function renderItems(props) {
  if (props.subject && props.subject.from) {
    // edge
    return (
      <>
        <MenuItem onClick={props.onInsertNode}>Insert node</MenuItem>
        <MenuItem
          onClick={props.onToggleEdgeSpace}
          className="react-contextmenu-item--toggle"
        >
          <div className="react-contextmenu-item__toggle">
            {props.subject.edge.space ? '✔' : ''}
          </div>
          Add space
        </MenuItem>
        <MenuItem onClick={props.onDeleteEdge}>Delete link</MenuItem>
      </>
    );
  }
  if (props.subject) {
    // node
    return (
      <>
        <MenuItem onClick={props.onSetNodeTitle}>Set title</MenuItem>
        <MenuItem onClick={props.onLinkToGenerator}>Link to generator</MenuItem>
        <MenuItem onClick={props.onAgreementLink}>Agreement link</MenuItem>
        <MenuItem onClick={props.onNodeFreeze}>Freeze</MenuItem>
        <MenuItem onClick={props.onDeleteNode}>Delete node</MenuItem>
      </>
    );
  }
  // stage
  return (
    <>
      <MenuItem onClick={props.onCreateNode}>New</MenuItem>
      <MenuItem onClick={props.onCenterGraph}>Center graph</MenuItem>
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
