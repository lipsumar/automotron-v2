import React from 'react';
import client from '../../client';
import PageLayout from '../PageLayout';
import GeneratorItem from '../GeneratorItem';

const exampleGeneratorIds = JSON.parse(
  process.env.REACT_APP_EXAMPLE_GENERATOR_IDS,
);

export default class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [] };
  }

  componentDidMount() {
    client.getGenerators(exampleGeneratorIds).then(generators => {
      this.setState({ generators });
    });
  }

  render() {
    return (
      <PageLayout user={this.props.user}>
        <h2 class="page-heading">Examples</h2>
        {this.state.generators.length > 0 ? (
          <div className="grid">
            {this.state.generators.map(generator => {
              return (
                <GeneratorItem
                  generator={generator}
                  showDelete={false}
                  key={generator._id}
                />
              );
            })}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </PageLayout>
    );
  }
}
