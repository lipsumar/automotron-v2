import React, { createRef } from 'react';
import client from '../client';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.usernameInputRef = createRef();
    this.state = { username: '', password: '', error: false };
  }

  componentDidMount() {
    this.usernameInputRef.current.focus();
  }

  login(e) {
    this.setState({ error: false });
    e.preventDefault();
    client
      .login(this.state.username, this.state.password)
      .then(user => {
        this.props.loginSuccess(user);
      })
      .catch(err => {
        let error = 'An error occured';
        if (err.response && err.response.status === 401) {
          error = 'Wrong credentials';
        }
        this.setState({ error });
      });
  }

  createAccount(e) {
    e.preventDefault();
    this.props.onCreateAccount();
  }

  render() {
    const { username, password, error } = this.state;
    return (
      <div className="login">
        {error && <p className="alert alert--error">{error}</p>}

        <form className="form" onSubmit={this.login.bind(this)}>
          <div className="form__field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => this.setState({ username: e.target.value })}
              ref={this.usernameInputRef}
            />
          </div>
          <div className="form__field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="form__action flex jc-sb ai-c">
            <button type="submit">Login</button>
            <a href="#" onClick={this.createAccount.bind(this)}>
              Create an account
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
