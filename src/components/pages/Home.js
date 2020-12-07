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
          <div style={{ marginBottom: 40 }}>
            <h2 className="section-heading">Your generators</h2>
            <UserGeneratorList user={this.props.user} />
          </div>
        )}

        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="responsive-video">
            <iframe
              src="https://www.youtube.com/embed/vr03bWKJKBA"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Tuto Automotron"
            ></iframe>
          </div>
        </div>
      </PageLayout>
    );
  }
}

export default Home;
