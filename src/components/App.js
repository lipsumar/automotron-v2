import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Help from './pages/Help';

function App() {
  return (
    <Router>
      <div>
        <Link to="/">Home</Link>
        <Link to="/help">Help</Link>
      </div>

      <Switch>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
