import React from 'react';
import client from '../../client';
import PageLayout from '../PageLayout';
import GeneratorItem from '../GeneratorItem';

export default class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: null, user: null };
    this.userId = this.props.match.params.userId;
  }

  componentDidMount() {
    client.getUser(this.userId).then(user => {
      this.setState({ user });
    });
    client.getUserGenerators(this.userId).then(generators => {
      this.setState({ generators });
    });
  }

  render() {
    return (
      <PageLayout user={this.props.user}>
        <h2 class="page-heading">{this.state.user?.email}</h2>
        {this.state.generators ? (
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
