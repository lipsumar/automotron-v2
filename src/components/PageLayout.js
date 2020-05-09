import React, { createRef } from 'react';
import client from '../client';
import Header from './Header';
import LoginModal from './LoginModal';

export default class PageLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showLoginModal: false };
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

  logout() {
    client.logout().then(this.refreshPage.bind(this));
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
          onLogout={this.logout.bind(this)}
        />
        {this.props.children}
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
