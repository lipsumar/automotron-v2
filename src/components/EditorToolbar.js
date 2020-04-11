import React from 'react';
import LoggedInStatus from './LoggedInStatus';

class EditorToolbar extends React.Component {
  promptGeneratorTitle() {
    const title = window.prompt('Generator title');
    this.props.setGeneratorTitle(title);
  }

  render() {
    if (!this.props.generator) return null;
    return (
      <div className="editor-toolbar">
        <div
          className="editor-toolbar__title"
          onClick={this.promptGeneratorTitle.bind(this)}
        >
          {this.props.generator.title}
        </div>
        <div className="editor-toolbar__tools">
          <button onClick={this.props.onRun}>Run</button>
          <button onClick={this.props.onSave}>Save</button>
          <div className="editor-toolbar__separator"></div>
          <button onClick={this.props.onUndo}>Undo</button>
          <button onClick={this.props.onRedo}>Redo</button>
        </div>
        <div className="editor-toolbar__user">
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
