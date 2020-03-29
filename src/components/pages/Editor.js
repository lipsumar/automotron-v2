import React, { createRef } from 'react';

import EditorUiComponent from '../EditorUi';
import Graph from '../../core/Graph';
import client from '../../client';
import EditorToolbar from '../EditorToolbar';
import ResultPanel from '../ResultPanel';
import GraphEvaluator from '../../core/GraphEvaluator';
import stringifyGraphResult from '../../core/stringifyGraphResult';
import LoginModal from '../LoginModal';
import exportService from '../../editor/services/exportService';
import { whenFontLoaded } from '../utils';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generator: null,
      result: null,
      showLoginModal: false,
      user: null,
      ready: false,
    };
    this.afterLoginSuccess = null;
    this.editorUiRef = createRef();
  }

  componentDidMount() {
    whenFontLoaded('Open Sans').then(() => {
      this.setState({ ready: true });
    });
    document.querySelector('html').style.overflow = 'hidden';
    window.document.body.style.overflow = 'hidden';
    const { generatorId } = this.props.match.params;
    client.getGenerator(generatorId).then(generatorData => {
      this.setState({
        generator: {
          ...generatorData,
          ...{ graph: Graph.fromJSON(generatorData.graph) },
        },
      });
    });
  }

  runGenerator() {
    const evaluator = new GraphEvaluator(this.state.generator.graph);
    evaluator.run().then(result => {
      this.setState({
        result: stringifyGraphResult(result),
      });
    });
  }

  saveGenerator() {
    client
      .saveGenerator(exportService.exportGenerator(this.state.generator))
      .then(result => {
        if (!this.state.generator._id) {
          this.setState({
            generator: {
              ...this.state.generator,
              _id: result._id,
            },
          });
          this.props.history.replace(`/editor/${result._id}`);
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 401) {
          this.afterLoginSuccess = this.saveGenerator.bind(this);
          this.setState({ showLoginModal: true });
          return;
        }
        console.log('error!', err);
      });
  }

  onLoginSuccess(user) {
    this.setState({ user });
    if (this.afterLoginSuccess) {
      this.afterLoginSuccess();
    }
  }

  undo() {
    this.editorUiRef.current.undo();
  }

  redo() {
    this.editorUiRef.current.redo();
  }

  render() {
    const { generator, result, showLoginModal, ready } = this.state;
    return (
      <div className="editor">
        <div className="editor__head">
          <EditorToolbar
            onRun={() => this.runGenerator()}
            onSave={() => this.saveGenerator()}
            onUndo={() => this.undo()}
            onRedo={() => this.redo()}
          />
        </div>
        <div className="editor__body">
          {generator && ready && (
            <EditorUiComponent ref={this.editorUiRef} graph={generator.graph} />
          )}
          <ResultPanel output={result} />
          <LoginModal
            isOpen={showLoginModal}
            onCloseRequest={() => this.setState({ showLoginModal: false })}
            onLoginSuccess={this.onLoginSuccess.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
