import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UndoIcon from './icons/UndoIcon';
import RedoIcon from './icons/RedoIcon';
import DuplicateIcon from './icons/DuplicateIcon';
import SaveIcon from './icons/SaveIcon';
import TextIcon from './icons/TextIcon';
import HtmlIcon from './icons/HtmlIcon';
import JsonIcon from './icons/JsonIcon';

function MenuItem({ icon, label }) {
  return (
    <div className="editor-menu-item">
      <div className="editor-menu-item__icon">{icon}</div>
      <div className="editor-menu-item__label">{label}</div>
    </div>
  );
}

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
              <MenuItem
                label={t('editor.menu.file.items.save')}
                icon={<SaveIcon />}
              />
            </div>
          )}
          <div className="editor-menu__menu-item">
            <MenuItem
              label={t('editor.menu.file.items.createCopy')}
              icon={<DuplicateIcon />}
            />
          </div>
          {/* <div className="editor-menu__menu-item">Share</div> */}
        </div>
      </div>
      <div className="editor-menu__item">
        {t('editor.menu.edit.title')}
        <div className="editor-menu__menu">
          <div className="editor-menu__menu-item" onClick={props.onUndo}>
            <MenuItem
              label={t('editor.menu.edit.items.undo')}
              icon={<UndoIcon />}
            />
          </div>
          <div className="editor-menu__menu-item" onClick={props.onRedo}>
            <MenuItem
              label={t('editor.menu.edit.items.redo')}
              icon={<RedoIcon />}
            />
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
            <MenuItem label={t('editor.menu.insert.items.text')} />
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
            <MenuItem
              label={t('editor.menu.export.items.text')}
              icon={<TextIcon />}
            />
          </div>
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('html')}
          >
            <MenuItem
              label={t('editor.menu.export.items.html')}
              icon={<HtmlIcon />}
            />
          </div>
          <div
            className="editor-menu__menu-item"
            onClick={() => props.onExport('json')}
          >
            <MenuItem
              label={t('editor.menu.export.items.json')}
              icon={<JsonIcon />}
            />
          </div>
        </div>
      </div>
      <div className="editor-menu__item">{t('editor.menu.help.title')}</div>
    </div>
  );
}
