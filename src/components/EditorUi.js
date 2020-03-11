import React from 'react';

import GraphUi from '../ui/GraphUi';
import TextNodeEdit from './TextNodeEdit';
import CommandInvoker from '../editor/CommandInvoker';

class EditorUiComponent extends React.Component {
  constructor(props) {
    super(props);
    this.stageRef = React.createRef();
    this.state = {
      graphBlur: false,
      nodeEdit: false,
      nodeEditValue: '',
    };
  }

  componentDidMount() {
    const commandInvoker = new CommandInvoker();
    const graphUi = new GraphUi(this.stageRef.current, this.props.graph, {
      editable: true,
      executeCommand: (command, options) => {
        commandInvoker.execute(command, options);
      },
    });
    commandInvoker.graph = this.props.graph;
    commandInvoker.ui = graphUi;
    graphUi.on('edit:start', uiNode => {
      this.setState({
        nodeEdit: {
          bbox: graphUi.getNodeBoundingBox(uiNode),
          value: uiNode.node.value,
          nodeId: uiNode.node.id,
        },
        graphBlur: true,
        nodeEditValue: uiNode.node.value,
      });
    });
    graphUi.on('edit:finish', () => {
      if (this.state.nodeEdit.value !== this.state.nodeEditValue) {
        commandInvoker.execute('setNodeValue', {
          nodeId: this.state.nodeEdit.nodeId,
          value: this.state.nodeEditValue,
        });
      }
      this.setState({
        nodeEdit: false,
        graphBlur: false,
      });
    });
  }

  render() {
    const { graphBlur, nodeEdit } = this.state;
    return (
      <>
        <div
          ref={this.stageRef}
          className={`graph-ui-stage ${graphBlur && 'graph-ui-stage--blur'}`}
        ></div>
        {nodeEdit && (
          <TextNodeEdit
            bbox={nodeEdit.bbox}
            value={nodeEdit.value}
            onChange={value => this.setState({ nodeEditValue: value })}
          />
        )}
      </>
    );
  }
}

export default EditorUiComponent;
