import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
        <Link to={`/`} className="editor-toolbar__logo">
          <Logo />
        </Link>
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
          >
            <SaveIcon />
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
