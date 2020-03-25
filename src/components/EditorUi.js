import React from 'react';

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
    };
  }

  componentDidMount() {
    const editorUi = new EditorUi(this.stageRef.current, this.props.graph, {
      openNodeEditor: (bbox, value) => {
        this.setState({
          nodeEdit: {
            bbox,
            value,
          },
          graphBlur: true,
          nodeEditValue: value,
        });
      },
      closeNodeEditor: () => {
        this.setState({
          nodeEdit: false,
          graphBlur: false,
        });
      },
      getNodeEditorValue: () => {
        return this.state.nodeEditValue;
      },
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
