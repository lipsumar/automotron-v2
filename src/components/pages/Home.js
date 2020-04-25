import React, { createRef } from 'react';
import { Link } from 'react-router-dom';

import Header from '../Header';
import LoginModal from '../LoginModal';

import UserGeneratorList from '../UserGeneratorList';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { generators: [], showLoginModal: false };
    this.loginModalRef = createRef();
  }

  componentDidMount() {
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
          user={this.props.user}
          onLoginClicked={this.showLogin.bind(this)}
          onRegisterClicked={this.showRegister.bind(this)}
          onLogout={this.props.onLogout}
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

        {this.props.user && (
          <>
            <h2 className="section-heading">Your generators</h2>
            <UserGeneratorList user={this.props.user} />
          </>
        )}

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
