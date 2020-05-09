import React from 'react';
import { Link } from 'react-router-dom';
import LoggedInStatus from './LoggedInStatus';

function Header(props) {
  return (
    <div className="header">
      <div className="header__left">
        {/* <Link to="/doc">Documentation</Link> */}
        <Link to="/examples">Examples</Link>
      </div>
      <div className="header__center">
        <h1>
          <Link to="/">automotron</Link>
        </h1>
      </div>
      <div className="header__right">
        {!props.user ? (
          <>
            <button className="btn" onClick={props.onLoginClicked}>
              Login
            </button>
            <button className="btn" onClick={props.onRegisterClicked}>
              Register
            </button>
          </>
        ) : (
          <LoggedInStatus user={props.user} onLogout={props.onLogout} />
        )}
      </div>
    </div>
  );
}

export default Header;
