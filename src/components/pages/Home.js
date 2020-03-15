import React from 'react';
import { Link } from 'react-router-dom';
import client from '../../client';
import Header from '../Header';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [] };
  }

  componentDidMount() {
    client.getGenerators().then(generators => {
      this.setState({ generators });
    });
    document.querySelector('html').style.overflow = '';
    window.document.body.style.overflow = '';
  }

  render() {
    return (
      <div className="container">
        <Header />
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

        <h2 className="section-heading">Your generators</h2>
        <div className="grid">
          {this.state.generators.map(generator => {
            return (
              <Link to={`/editor/${generator._id}`} className="generator-card">
                <div className="generator-card__image">
                  <img src={generator.preview} />
                </div>
                <div className="generator-card__title">{generator.title}</div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Home;
