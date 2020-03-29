import React from 'react';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <div className="header">
      <div className="header__left">
        <Link to="/doc">Documentation</Link>
        <Link to="/doc">Examples</Link>
      </div>
      <div className="header__center">
        <h1>automotron</h1>
      </div>
      <div className="header__right">
        <button className="btn" onClick={props.onLoginClicked}>
          Login
        </button>
        <button className="btn" onClick={props.onRegisterClicked}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Header;
