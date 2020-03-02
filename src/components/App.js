import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Help from './pages/Help';
import Editor from './pages/Editor';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/editor">
          <Editor />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
