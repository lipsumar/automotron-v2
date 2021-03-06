import React from 'react';
import { withTranslation } from 'react-i18next';
import UndoBtnIcon from './icons/UndoBtnIcon';
import SaveIcon from './icons/SaveIcon';
import LoggedInStatus from './LoggedInStatus';
import Logo from './icons/Logo';
import EditorMenu from './EditorMenu';

class EditorToolbar extends React.Component {
  promptGeneratorTitle() {
    // eslint-disable-next-line no-alert
    const title = window.prompt(this.props.t('editor.prompt.generatorTitle'));
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
        <a
          href={this.props.i18n.language === 'fr' ? '/fr' : '/'}
          className="editor-toolbar__logo"
        >
          <Logo />
        </a>
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
              onExport={this.props.onExport}
              onFork={this.props.onFork}
            />
          </div>
        </div>

        <div className="editor-toolbar__right">
          <button
            className="btn btn--icon btn--toolbar"
            onClick={this.props.onUndo}
          >
            <UndoBtnIcon />
          </button>
          <button
            className="btn btn--icon btn--toolbar"
            onClick={this.props.onSave}
            disabled={!canSave}
          >
            <SaveIcon />
            {!this.props.changesSaved && <div className="red-dot"></div>}
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

export default withTranslation()(EditorToolbar);
