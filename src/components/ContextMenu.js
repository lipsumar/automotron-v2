import React from 'react';
import { ContextMenu as ReactContextMenu, MenuItem } from 'react-contextmenu';
import { useTranslation } from 'react-i18next';

function MenuItems(props) {
  const { t } = useTranslation();
  if (props.subject && props.subject.from) {
    // edge
    return (
      <>
        {props.subject.edge.type === 'default' && (
          <>
            <MenuItem onClick={props.onInsertNode}>
              {t('editor.contextMenu.insertNode')}
            </MenuItem>
            <MenuItem
              onClick={props.onToggleEdgeSpace}
              className="react-contextmenu-item--toggle"
            >
              <div className="react-contextmenu-item__toggle">
                {props.subject.edge.space ? '✔' : ''}
              </div>
              {t('editor.contextMenu.addSpace')}
            </MenuItem>
          </>
        )}
        <MenuItem onClick={props.onDeleteEdge}>
          {t('editor.contextMenu.deleteEdge')}
        </MenuItem>
      </>
    );
  }
  if (props.subject) {
    // node
    return (
      <>
        <MenuItem onClick={props.onSetNodeTitle}>
          {t('editor.contextMenu.setTitle')}
        </MenuItem>
        <MenuItem onClick={props.onLinkToGenerator}>
          {t('editor.contextMenu.linkToGenerator')}
        </MenuItem>
        <MenuItem onClick={props.onAgreementLink}>
          {t('editor.contextMenu.agreementLink')}
        </MenuItem>
        {props.subject.node.frozen ? (
          <MenuItem onClick={props.onNodeUnfreeze}>
            {t('editor.contextMenu.unfreeze')}
          </MenuItem>
        ) : (
          <MenuItem onClick={props.onNodeFreeze}>
            {t('editor.contextMenu.freeze')}
          </MenuItem>
        )}

        <MenuItem onClick={props.onDeleteNode}>
          {t('editor.contextMenu.deleteNode')}
        </MenuItem>
      </>
    );
  }
  // stage
  return (
    <>
      <MenuItem onClick={props.onCreateNode}>
        {t('editor.contextMenu.createNode')}
      </MenuItem>
      <MenuItem onClick={props.onCenterGraph}>
        {t('editor.contextMenu.centerGraph')}
      </MenuItem>
    </>
  );
}

export default function ContextMenu(props) {
  return (
    <ReactContextMenu id="canvas-context-menu" onHide={props.onHide}>
      <MenuItems {...props} />
    </ReactContextMenu>
  );
}
