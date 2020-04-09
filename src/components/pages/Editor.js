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
import countPossibilities from '../../core/countPossibilities';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generator: null,
      result: null,
      showLoginModal: false,
      user: null,
      ready: false,
      possibilityCount: null,
    };
    this.afterLoginSuccess = null;
    this.editorUiRef = createRef();

    // dev utility
    window.exportGraph = () =>
      exportService.exportGenerator(this.state.generator);
  }

  componentDidMount() {
    whenFontLoaded('Open Sans').then(() => {
      this.setState({ ready: true });
    });
    document.querySelector('html').style.overflow = 'hidden';
    window.document.body.style.overflow = 'hidden';
    const { generatorId } = this.props.match.params;
    client.getGenerator(generatorId).then(generatorData => {
      this.setState(
        {
          generator: {
            ...generatorData,
            ...{ graph: Graph.fromJSON(generatorData.graph) },
          },
        },
        () => this.updatePossibilityCount(),
      );
    });
  }

  runGenerator() {
    const evaluator = new GraphEvaluator(this.state.generator.graph);
    evaluator.play().then(result => {
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
    this.props.onLogin(user);
    this.setState({ showLoginModal: false });
    if (this.afterLoginSuccess) {
      this.afterLoginSuccess();
    }
  }

  onGraphChange() {
    this.updatePossibilityCount();
  }

  updatePossibilityCount() {
    try {
      const count = countPossibilities(this.state.generator.graph);
      this.setState({ possibilityCount: count });
    } catch (err) {
      if (err instanceof RangeError) {
        this.setState({ possibilityCount: Infinity });
      } else {
        this.setState({ possibilityCount: null });
      }
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
            user={this.props.user}
            onRun={() => this.runGenerator()}
            onSave={() => this.saveGenerator()}
            onUndo={() => this.undo()}
            onRedo={() => this.redo()}
            onLogout={this.props.onLogout}
          />
        </div>
        <div className="editor__body">
          {generator && ready && (
            <EditorUiComponent
              ref={this.editorUiRef}
              graph={generator.graph}
              onGraphChange={this.onGraphChange.bind(this)}
            />
          )}
          <ResultPanel output={result} count={this.state.possibilityCount} />
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
