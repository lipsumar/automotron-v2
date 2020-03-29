import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Modal from 'react-modal';
import Home from './pages/Home';
import Help from './pages/Help';
import Editor from './pages/Editor';
import View from './pages/View';
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
      this.setState({ user });
    });
  }

  logout() {
    client.logout().then(this.refreshPage.bind(this));
  }

  refreshPage() {
    window.location.reload();
  }

  render() {
    const { user } = this.state;
    return (
      <Router>
        <Switch>
          <Route path="/help">
            <Help />
          </Route>
          <Route
            path="/editor/:generatorId"
            render={props => (
              <Editor
                {...props}
                user={user}
                onLogout={this.logout.bind(this)}
              />
            )}
          />
          <Route path="/view">
            <View />
          </Route>
          <Route path="/">
            <Home user={user} onLogout={this.logout.bind(this)} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
