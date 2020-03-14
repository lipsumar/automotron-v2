import React, { createRef } from 'react';
import client from '../client';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      error: false,
    };
    this.usernameInputRef = createRef();
  }

  componentDidMount() {
    this.usernameInputRef.current.focus();
  }

  login(e) {
    e.preventDefault();
    this.props.onLogin();
  }

  createAccount(e) {
    e.preventDefault();
    const { username, password, passwordConfirm } = this.state;
    if (password !== passwordConfirm) {
      this.setState({ error: 'passwords don’t match' });
      return;
    }
    client
      .register(username, password)
      .then(user => {
        this.props.onRegisterSuccess(user);
      })
      .catch(err => {
        let error = 'an error occured';
        if (err.response && err.response.data && err.response.data.error) {
          error = err.response.data.message;
        }
        this.setState({ error });
        console.log(err);
      });
  }

  render() {
    const { username, password, passwordConfirm, error } = this.state;
    return (
      <div className="register">
        {error && <p className="alert alert--error">{error}</p>}
        <form className="form" onSubmit={this.createAccount.bind(this)}>
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
          <div className="form__field">
            <label>Confirm password</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={e => this.setState({ passwordConfirm: e.target.value })}
            />
          </div>
          <div className="form__action flex jc-sb ai-c">
            <button type="submit">Create account</button>
            <a href="#" onClick={this.login.bind(this)}>
              Login
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
