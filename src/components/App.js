import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Modal from 'react-modal';
import Home from './pages/Home';
import Help from './pages/Help';
import Editor from './pages/Editor';
import View from './pages/View';

Modal.setAppElement('#root');
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/editor/:generatorId" component={Editor} />
        <Route path="/view">
          <View />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
