import React, { createRef } from 'react';
import emailValidator from 'email-validator';
import { withTranslation } from 'react-i18next';
import client from '../client';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
    };
    this.emailInputRef = createRef();
  }

  componentDidMount() {
    this.emailInputRef.current.focus();
  }

  login(e) {
    e.preventDefault();
    this.props.onLogin();
  }

  createAccount(e) {
    e.preventDefault();
    this.setState({ error: false });
    const { email, password } = this.state;
    if (!emailValidator.validate(email)) {
      this.setState({ error: this.props.t('register.error.invalidEmail') });
      return;
    }
    if (password.length < 4) {
      this.setState({ error: this.props.t('register.error.passwordTooShort') });
      return;
    }
    client
      .register(email, password)
      .then(user => {
        this.props.onRegisterSuccess(user);
      })
      .catch(err => {
        let error = this.props.t('register.error.registerFailed');
        if (err.response && err.response.data && err.response.data.error) {
          error = this.props.t(err.response.data.message);
        }
        this.setState({ error });
        console.log(err);
      });
  }

  render() {
    const { email, password, error } = this.state;
    return (
      <div className="register">
        {error && <p className="alert alert--error">{error}</p>}
        <form className="form" onSubmit={this.createAccount.bind(this)}>
          <div className="form__field">
            <label>{this.props.t('register.field.email')}</label>
            <input
              type="text"
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
              ref={this.emailInputRef}
            />
          </div>
          <div className="form__field">
            <label>{this.props.t('register.field.password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="form__action flex jc-sb ai-c">
            <button type="submit" className="btn btn--primary btn--large">
              {this.props.t('register.button.createAccount')}
            </button>
            <button className="btn btn--link" onClick={this.login.bind(this)}>
              {this.props.t('register.button.login')}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withTranslation()(Register);
