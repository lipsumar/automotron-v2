import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function EditorMenu(props) {
  const [active, setActive] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={`editor-menu ${active ? 'editor-menu--active' : ''}`}
      onClick={() => setActive(!active)}
    >
      <div className="editor-menu__item">
        {t('editor.menu.file.title')}
        <div className="editor-menu__menu">
          {props.canSave && (
            <div className="editor-menu__menu-item" onClick={props.onSave}>
              {t('editor.menu.file.items.save')}
            </div>
          )}
          <div className="editor-menu__menu-item">
            {t('editor.menu.file.items.createCopy')}
          </div>
          {/* <div className="editor-menu__menu-item">Share</div> */}
        </div>
      </div>
      <div className="editor-menu__item">
        {t('editor.menu.edit.title')}
        <div className="editor-menu__menu">
          <div className="editor-menu__menu-item" onClick={props.onUndo}>
            {t('editor.menu.edit.items.undo')}
          </div>
          <div className="editor-menu__menu-item" onClick={props.onRedo}>
            {t('editor.menu.edit.items.redo')}
          </div>
          {/* <div className="editor-menu__menu-separator"></div>
          <div className="editor-menu__menu-item">Copy</div>
          <div className="editor-menu__menu-item">Paste</div> */}
        </div>
      </div>
      <div className="editor-menu__item">
        {t('editor.menu.insert.title')}
        <div className="editor-menu__menu">
          <div className="editor-menu__menu-item" onClick={props.onInsertText}>
            {t('editor.menu.insert.items.text')}
          </div>
        </div>
      </div>
      <div className="editor-menu__item">
        {t('editor.menu.export.title')}
        <div className="editor-menu__menu">
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('text')}
          >
            {t('editor.menu.export.items.text')}
          </div>
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('html')}
          >
            {t('editor.menu.export.items.html')}
          </div>
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('json')}
          >
            {t('editor.menu.export.items.json')}
          </div>
        </div>
      </div>
      <div className="editor-menu__item">{t('editor.menu.help.title')}</div>
    </div>
  );
}
