import React from 'react';
import client from '../client';
import GeneratorItem from './GeneratorItem';

class UserGeneratorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [] };
  }

  componentDidMount() {
    client
      .getUserGenerators(this.props.user._id)
      .then(generators => {
        this.setState({ generators });
      })
      .catch(err => {});
  }

  deleteGenerator(generatorId) {
    if (window.confirm('Are you sure ?')) {
      client.deleteGenerator(generatorId).then(() => {
        this.setState({
          generators: this.state.generators.filter(g => g._id !== generatorId),
        });
      });
    }
  }

  render() {
    return (
      <div className="grid">
        {this.state.generators.map(generator => {
          return (
            <GeneratorItem
              generator={generator}
              showDelete={true}
              onDelete={this.deleteGenerator.bind(this)}
              key={generator._id}
            />
          );
        })}
      </div>
    );
  }
}

export default UserGeneratorList;
