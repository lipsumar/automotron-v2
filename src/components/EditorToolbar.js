import React from 'react';
import { Trans } from 'react-i18next';
import UndoIcon from './icons/UndoIcon';
import SaveIcon from './icons/SaveIcon';
import LoggedInStatus from './LoggedInStatus';
import Logo from './icons/Logo';
import EditorMenu from './EditorMenu';

class EditorToolbar extends React.Component {
  promptGeneratorTitle() {
    const title = window.prompt('Generator title');
    if (title) {
      this.props.setGeneratorTitle(title);
    }
  }

  canSave() {
    if (!this.props.user) {
      return !this.props.generator._id;
    }
    return (
      this.props.user._id === this.props.generator.userId ||
      !this.props.generator._id
    );
  }

  render() {
    if (!this.props.generator) return null;
    const canSave = this.canSave();
    return (
      <div className="editor-toolbar">
        <div className="editor-toolbar__logo">
          <Logo />
        </div>
        <div className="editor-toolbar__left">
          <div
            className="editor-toolbar__title"
            onClick={this.promptGeneratorTitle.bind(this)}
          >
            {this.props.generator.title}
          </div>
          <div className="editor-toolbar__menu">
            <EditorMenu
              onSave={this.props.onSave}
              onUndo={this.props.onUndo}
              onRedo={this.props.onRedo}
              onInsertText={this.props.onInsertText}
              canSave={canSave}
            />
          </div>
        </div>

        <div className="editor-toolbar__right">
          <button
            className="btn btn--icon btn--toolbar"
            onClick={this.props.onUndo}
          >
            <UndoIcon />
          </button>
          <button
            className="btn btn--icon btn--toolbar"
            onClick={this.props.onSave}
          >
            <SaveIcon />
          </button>
          <button
            className="btn btn--primary btn--toolbar"
            onClick={this.props.onRun}
          >
            <Trans>editor.action.run</Trans>
          </button>
          {this.props.user && (
            <LoggedInStatus
              user={this.props.user}
              onLogout={this.props.onLogout}
            />
          )}
        </div>
      </div>
    );
  }
}

export default EditorToolbar;
