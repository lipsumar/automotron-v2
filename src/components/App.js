import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Modal from 'react-modal';
import * as Sentry from '@sentry/browser';
import Help from './pages/Help';
import Editor from './pages/Editor';
import Examples from './pages/Examples';
import View from './pages/View';
import Admin from './pages/Admin';
import User from './pages/User';
import client from '../client';

Modal.setAppElement('#root');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    client.loggedIn().then(user => {
      Sentry.configureScope(scope => {
        scope.setUser({ username: user.email, id: user._id });
      });
      this.setState({ user });
    });
  }

  render() {
    const { user } = this.state;
    return (
      <Router basename="/editor">
        <Switch>
          <Route path="/help">
            <Help />
          </Route>
          <Route path="/examples">
            <Examples user={user} />
          </Route>
          <Route path="/view">
            <View />
          </Route>
          <Route path="/admin">
            <Admin user={user} />
          </Route>
          <Route
            path="/user/:userId"
            render={props => <User {...props} user={user} />}
          ></Route>
          <Route
            path="/:generatorId"
            render={props => (
              <Editor
                {...props}
                user={user}
                onLogin={theUser => this.setState({ user: theUser })}
              />
            )}
          />
          <Route path="/">
            <Redirect to="/new" />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
