import React from 'react';
import { Link } from 'react-router-dom';

import UserGeneratorList from '../UserGeneratorList';
import PageLayout from '../PageLayout';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [] };
  }

  render() {
    return (
      <PageLayout user={this.props.user}>
        <div
          style={{
            padding: '140px 0',
            textAlign: 'center',
            background:
              'radial-gradient(circle, rgba(232,232,232,1) 0%, rgba(255,255,255,1) 64%)',
          }}
        >
          <Link to="/editor/new" className="btn btn--primary btn--large">
            Create a generator
          </Link>
        </div>

        {this.props.user && (
          <>
            <h2 className="section-heading">Your generators</h2>
            <UserGeneratorList user={this.props.user} />
          </>
        )}
      </PageLayout>
    );
  }
}

export default Home;
