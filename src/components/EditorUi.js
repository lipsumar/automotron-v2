import React from 'react';

import { ContextMenuTrigger } from 'react-contextmenu';
import ContextMenu from './ContextMenu';
import TextNodeEdit from './TextNodeEdit';
import EditorUi from '../editor/EditorUi';

class EditorUiComponent extends React.Component {
  constructor(props) {
    super(props);
    this.stageRef = React.createRef();
    this.state = {
      graphBlur: false,
      nodeEdit: false,
      nodeEditValue: '',
      contextMenuSubject: null,
    };
  }

  componentDidMount() {
    this.editorUi = new EditorUi(
      this.stageRef.current,
      this.props.graph,
      {
        openNodeEditor: (bbox, node) => {
          this.setState({
            nodeEdit: {
              bbox,
              value: node.value,
            },
            graphBlur: true,
            nodeEditValue: node.value,
            nodeEditId: node.id,
          });
        },
      },
      {
        panelWidth: this.props.panelWidth,
      },
    );

    this.editorUi.on('node:contextmenu', uiNode => {
      this.setState({ contextMenuSubject: uiNode });
    });
    this.editorUi.on('edge:contextmenu', uiEdge => {
      this.setState({ contextMenuSubject: uiEdge });
    });
    this.editorUi.on('graph:change', () => {
      this.props.onGraphChange();
    });
  }

  onContextMenuHide() {
    this.setState({ contextMenuSubject: null });
  }

  createNode() {
    this.editorUi.createNode();
  }

  removeNode() {
    this.editorUi.removeNode(this.state.contextMenuSubject.node.id);
  }

  removeEdge() {
    this.editorUi.removeEdge(this.state.contextMenuSubject.edge.id);
  }

  insertNode() {
    this.editorUi.insertNode(this.state.contextMenuSubject.edge.id);
  }

  linkToGenerator() {
    this.editorUi.initiateEdgeToGenerator(
      this.state.contextMenuSubject.node.id,
    );
  }

  linkToAgreement() {
    this.editorUi.initiateEdgeToAgreement(
      this.state.contextMenuSubject.node.id,
    );
  }

  setNodeTitle() {
    const title = window.prompt('Title');
    this.editorUi.setNodeTitle(this.state.contextMenuSubject.node.id, title);
  }

  freezeNode() {
    this.editorUi.freezeNode(this.state.contextMenuSubject.node.id);
  }

  centerGraph() {
    this.editorUi.centerGraph();
  }

  setNodeError(nodeId, error) {
    this.editorUi.setNodeError(nodeId, error);
  }

  resetNodeErrors() {
    this.editorUi.resetNodeErrors();
  }

  toggleEdgeSpace() {
    this.editorUi.toggleEdgeSpace(this.state.contextMenuSubject.edge.id);
  }

  setNodeValue() {
    this.editorUi.setNodeValue(this.state.nodeEditId, this.state.nodeEditValue);
    // close editor
    this.setState({
      nodeEdit: false,
      graphBlur: false,
    });
  }

  undo() {
    this.editorUi.undo();
  }

  redo() {
    this.editorUi.redo();
  }

  render() {
    const { graphBlur, nodeEdit } = this.state;
    return (
      <>
        <ContextMenuTrigger id="canvas-context-menu" holdToDisplay={-1}>
          <div
            ref={this.stageRef}
            className={`graph-ui-stage ${graphBlur && 'graph-ui-stage--blur'}`}
          ></div>
        </ContextMenuTrigger>
        {nodeEdit && (
          <TextNodeEdit
            bbox={nodeEdit.bbox}
            value={nodeEdit.value}
            onChange={value => this.setState({ nodeEditValue: value })}
            onClose={this.setNodeValue.bind(this)}
          />
        )}
        <ContextMenu
          subject={this.state.contextMenuSubject}
          onHide={this.onContextMenuHide.bind(this)}
          onCreateNode={this.createNode.bind(this)}
          onDeleteNode={this.removeNode.bind(this)}
          onDeleteEdge={this.removeEdge.bind(this)}
          onInsertNode={this.insertNode.bind(this)}
          onLinkToGenerator={this.linkToGenerator.bind(this)}
          onSetNodeTitle={this.setNodeTitle.bind(this)}
          onAgreementLink={this.linkToAgreement.bind(this)}
          onNodeFreeze={this.freezeNode.bind(this)}
          onCenterGraph={this.centerGraph.bind(this)}
          onToggleEdgeSpace={this.toggleEdgeSpace.bind(this)}
        />
      </>
    );
  }
}

export default EditorUiComponent;
