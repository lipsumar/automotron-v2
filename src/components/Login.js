import React, { createRef } from 'react';
import { withTranslation } from 'react-i18next';
import client from '../client';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.emailInputRef = createRef();
    this.state = { email: '', password: '', error: false };
  }

  componentDidMount() {
    this.emailInputRef.current.focus();
  }

  login(e) {
    this.setState({ error: false });
    e.preventDefault();
    client
      .login(this.state.email, this.state.password)
      .then(user => {
        this.props.onLoginSuccess(user);
      })
      .catch(err => {
        let error = this.props.t('login.error.loginFailed');
        if (err.response && err.response.status === 401) {
          error = this.props.t('login.error.wrongCredentials');
        }
        this.setState({ error });
      });
  }

  createAccount(e) {
    e.preventDefault();
    this.props.onCreateAccount();
  }

  render() {
    const { email, password, error } = this.state;
    return (
      <div className="login">
        {error && <p className="alert alert--error">{error}</p>}

        <form className="form" onSubmit={this.login.bind(this)}>
          <div className="form__field">
            <label>{this.props.t('login.field.email')}</label>
            <input
              type="text"
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
              ref={this.emailInputRef}
            />
          </div>
          <div className="form__field">
            <label>
              {this.props.t('login.field.password')}
              <div className="label-aside">
                <a href="/reset-password">
                  {this.props.t('login.link.forgotPassword')}
                </a>
              </div>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="form__action flex jc-sb ai-c">
            <button type="submit" className="btn btn--primary btn--large">
              {this.props.t('login.button.login')}
            </button>
            <button
              className="btn btn--link"
              onClick={this.createAccount.bind(this)}
            >
              {this.props.t('login.button.createAccount')}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withTranslation()(Login);
