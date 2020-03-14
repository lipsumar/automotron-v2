import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Modal from 'react-modal';
import Home from './pages/Home';
import Help from './pages/Help';
import Editor from './pages/Editor';
import View from './pages/View';
import { whenFontLoaded } from './utils';

Modal.setAppElement('#root');
function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    whenFontLoaded('Open Sans').then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/help">
          <Help />
        </Route>
        <Route path="/editor">{loading ? 'Loading...' : <Editor />}</Route>
        <Route path="/view">{loading ? 'Loading...' : <View />}</Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
