import React, { createRef } from 'react';
import * as Sentry from '@sentry/browser';
import { Trans, withTranslation } from 'react-i18next';
import { Prompt } from 'react-router-dom';
import Loader from 'react-loaders';
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
      error: null,
      showLoginModal: false,
      ready: false,
      possibilityCount: null,
      changesSaved: true,
    };
    this.afterLoginSuccess = null;
    this.editorUiRef = createRef();

    if (window.location.href.match('/fr/')) {
      this.props.i18n.changeLanguage('fr');
    }

    // dev utility
    window.exportGraph = () =>
      exportService.exportGenerator(this.state.generator);

    window.addEventListener('beforeunload', e => {
      if (!this.state.changesSaved) {
        const msg = this.props.t('editor.prompt.unsavedChanges');
        e.returnValue = msg;
        return msg;
      }
      return null;
    });
  }

  componentDidMount() {
    whenFontLoaded('Open Sans').then(() => {
      this.setState({ ready: true });
    });
    this.setState({
      panelWidth:
        document.body.offsetWidth -
        document.querySelector('.result-panel').getBoundingClientRect().x,
    });
    document.querySelector('html').style.overflow = 'hidden';
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
    this.editorUiRef.current.resetNodeErrors();
    const evaluator = new GraphEvaluator(this.state.generator.graph);
    evaluator
      .play()
      .then(result => {
        this.setState({
          error: null,
          result: stringifyGraphResult(result),
        });
      })
      .catch(err => {
        Sentry.captureException(err);
        this.setState({
          result: null,
          error: err,
        });
        this.editorUiRef.current.setNodeError(err.nodeId, err);
        console.log('err!', err.nodeId, err);
      });
  }

  saveGenerator() {
    client
      .saveGenerator(exportService.exportGenerator(this.state.generator))
      .then(result => {
        this.setState({ changesSaved: true });

        if (!this.state.generator._id) {
          this.setState({
            generator: {
              ...this.state.generator,
              _id: result._id,
              userId: this.props.user._id,
            },
          });
          this.props.history.replace(
            `${this.props.i18n.language === 'fr' ? '/fr' : ''}/editor/${
              result._id
            }`,
          );
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

  forkGenerator() {
    const original = exportService.exportGenerator(this.state.generator);
    const forked = {
      ...original,
      title: `(${this.props.t('editor.forkTitlePrepend')}) ${original.title}`,
      userId: undefined,
      _id: undefined,
    };

    client.saveGenerator(forked).then(result => {
      this.setState({ changesSaved: true });
      window.location.href = `${
        this.props.i18n.language === 'fr' ? '/fr' : ''
      }/editor/${result._id}`;
    });
  }

  export(format) {
    if (!this.state.generator._id) {
      alert(this.props.t('editor.message.saveNeeded'));
      return;
    }
    window.open(
      `${process.env.REACT_APP_API_BASE_URL}/api/generators/${this.state.generator._id}/run?format=${format}`,
    );
  }

  setGeneratorTitle(title) {
    this.setState(
      {
        generator: {
          ...this.state.generator,
          title,
        },
      },
      this.saveGenerator.bind(this),
    );
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

  insertTextNode() {
    this.editorUiRef.current.createNode();
  }

  undo() {
    this.editorUiRef.current.undo();
  }

  redo() {
    this.editorUiRef.current.redo();
  }

  render() {
    const {
      generator,
      result,
      showLoginModal,
      ready,
      changesSaved,
    } = this.state;
    return (
      <div className="editor-wrapper">
        <Prompt
          when={!changesSaved}
          message={() => this.props.t('editor.prompt.unsavedChanges')}
        />
        <div className="editor">
          <div className="editor__head">
            <EditorToolbar
              generator={generator}
              user={this.props.user}
              onRun={() => this.runGenerator()}
              onSave={() => this.saveGenerator()}
              onUndo={() => this.undo()}
              onRedo={() => this.redo()}
              onLogout={this.props.onLogout}
              setGeneratorTitle={this.setGeneratorTitle.bind(this)}
              onInsertText={() => this.insertTextNode()}
              onExport={format => this.export(format)}
              onFork={() => this.forkGenerator()}
              changesSaved={changesSaved}
            />
          </div>
          <div className="editor__body">
            {generator && ready ? (
              <EditorUiComponent
                ref={this.editorUiRef}
                graph={generator.graph}
                onGraphChange={this.onGraphChange.bind(this)}
                panelWidth={this.state.panelWidth}
                onChange={() => {
                  this.setState({ changesSaved: false });
                }}
              />
            ) : (
              <div>
                <Loader
                  type="ball-scale-ripple-multiple"
                  style={{ marginLeft: '50%', marginTop: '40vh' }}
                />
              </div>
            )}

            <LoginModal
              isOpen={showLoginModal}
              onCloseRequest={() => this.setState({ showLoginModal: false })}
              onLoginSuccess={this.onLoginSuccess.bind(this)}
            />
          </div>
        </div>
        <div className="sidebar">
          <div className="sidebar__head">
            <button
              className="btn btn--primary btn--toolbar"
              onClick={() => this.runGenerator()}
            >
              <Trans>editor.action.run</Trans>
            </button>
          </div>
          <div className="sidebar__body">
            <ResultPanel
              output={result}
              error={this.state.error}
              count={this.state.possibilityCount}
            />
          </div>
          <div className="sidebar__footer">
            {this.state.possibilityCount && this.state.possibilityCount > 0 ? (
              <>
                {this.state.possibilityCount.toLocaleString()}{' '}
                {this.props.t(
                  this.state.possibilityCount === 1
                    ? 'editor.sidebar.possibility'
                    : 'editor.sidebar.possibilities',
                )}
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Editor);
