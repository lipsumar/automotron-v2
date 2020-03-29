import React, { createRef } from 'react';
import { Link } from 'react-router-dom';
import client from '../../client';
import Header from '../Header';
import LoginModal from '../LoginModal';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [], showLoginModal: false };
    this.loginModalRef = createRef();
  }

  componentDidMount() {
    client
      .getGenerators()
      .then(generators => {
        this.setState({ generators });
      })
      .catch(err => {});
    document.querySelector('html').style.overflow = '';
    window.document.body.style.overflow = '';
  }

  showLogin() {
    this.loginModalRef.current.switchToLogin();
    this.setState({ showLoginModal: true });
  }

  showRegister() {
    this.loginModalRef.current.switchToRegister();
    this.setState({ showLoginModal: true });
  }

  refreshPage() {
    window.location.reload();
  }

  render() {
    return (
      <div className="container">
        <Header
          onLoginClicked={this.showLogin.bind(this)}
          onRegisterClicked={this.showRegister.bind(this)}
        />
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
                  <img src={generator.preview} alt={generator.title} />
                </div>
                <div className="generator-card__title">{generator.title}</div>
              </Link>
            );
          })}
        </div>

        <LoginModal
          ref={this.loginModalRef}
          isOpen={this.state.showLoginModal}
          onCloseRequest={() => this.setState({ showLoginModal: false })}
          onLoginSuccess={this.refreshPage.bind(this)}
        />
      </div>
    );
  }
}

export default Home;
