import React from 'react';

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
      showLogin: false,
      user: null,
      ready: false,
    };
    this.afterLoginSuccess = null;
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
          this.setState({ showLogin: true });
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

  render() {
    const { generator, result, showLogin, ready } = this.state;
    return (
      <div className="editor">
        <div className="editor__head">
          <EditorToolbar
            onRun={() => this.runGenerator()}
            onSave={() => this.saveGenerator()}
          />
        </div>
        <div className="editor__body">
          {generator && ready && <EditorUiComponent graph={generator.graph} />}
          <ResultPanel output={result} />
          <LoginModal
            isOpen={showLogin}
            onLoginSuccess={this.onLoginSuccess.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
