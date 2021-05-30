import React from 'react';
import Graph from '../../core/Graph';
import GraphUi from '../../components/GraphUi';

import './style.css';
import { whenFontLoaded } from '../../components/utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.graph = Graph.fromJSON(
      JSON.parse(
        `{"nodes":[{"id":1,"ui":{"x":-50,"y":-50,"generatorValue":null,"width":100,"height":75},"type":"start","evaluatedResult":{"agreement":null}},{"id":2,"ui":{"x":300,"y":-50,"generatorValue":null,"width":52,"height":88},"type":"text","frozen":false,"value":[{"text":"le","agreement":{"gender":"m","number":"s"},"rawText":"le(m,s)"},{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}],"evaluatedResult":{"text":"la","agreement":{"gender":"f","number":"s"},"rawText":"la(f,s)"}},{"id":3,"ui":{"x":524,"y":-251,"width":116.798828125,"height":88},"type":"text","frozen":true,"value":[{"text":"prince","agreement":{"gender":"m","number":"s"},"rawText":"prince(m,s)"},{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}],"title":"héro","evaluatedResult":{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}},{"id":4,"ui":{"x":399,"y":-51,"width":71.740234375,"height":52,"generatorValue":{"text":"héro"}},"type":"text","frozen":false,"value":[{"text":"aaah!"}],"evaluatedResult":{"results":[{"nodeId":3,"result":{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}}],"agreement":{"gender":"f","number":"s"}}},{"id":5,"ui":{"x":549,"y":-51,"width":69.767578125,"height":52,"generatorValue":null},"type":"text","frozen":false,"value":[{"text":"c'est","rawText":"c'est"}],"evaluatedResult":{"text":"c'est","rawText":"c'est","agreement":null}},{"id":7,"ui":{"x":674,"y":-51,"width":63.771484375,"height":88},"type":"text","frozen":false,"value":[{"text":"un","agreement":{"gender":"m","number":"s"},"rawText":"un(m,s)"},{"text":"une","agreement":{"gender":"f","number":"s"},"rawText":"une(f,s)"}],"evaluatedResult":{"text":"une","agreement":{"gender":"f","number":"s"},"rawText":"une(f,s)"}},{"id":8,"ui":{"x":774,"y":-51,"width":71.740234375,"height":52,"generatorValue":{"text":"héro"}},"type":"text","frozen":false,"value":[{"text":"aaah!"}],"evaluatedResult":{"results":[{"nodeId":3,"result":{"text":"princesse","agreement":{"gender":"f","number":"s"},"rawText":"princesse(f,s)"}}],"agreement":{"gender":"f","number":"s"}}}],"edges":[{"from":{"id":1},"to":{"id":2},"type":"default"},{"from":{"id":2},"to":{"id":4},"type":"default"},{"from":{"id":4},"to":{"id":5},"type":"default"},{"from":{"id":5},"to":{"id":7},"type":"default"},{"from":{"id":7},"to":{"id":8},"type":"default"},{"from":{"id":8},"to":{"id":7},"type":"agreement"},{"from":{"id":4},"to":{"id":2},"type":"agreement"},{"from":{"id":8},"to":{"id":3},"type":"generator"},{"from":{"id":4},"to":{"id":3},"type":"generator"}]}`,
      ),
    );
    this.state = { ready: false };
  }

  componentDidMount() {
    whenFontLoaded('Open Sans').then(() => {
      this.setState({ ready: true });
    });
  }

  render() {
    const { ready } = this.state;

    return (
      <div>
        <div style={{ height: 0, overflow: 'hidden' }}>font</div>
        {ready && <GraphUi graph={this.graph} />}
      </div>
    );
  }
}

export default App;
