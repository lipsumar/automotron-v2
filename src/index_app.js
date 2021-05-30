import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import * as Sentry from '@sentry/browser';
import './i18n';
import App from './components/App';

Sentry.init({
  dsn:
    'https://24a8a39772ae45c0b861456bfb1b2a9e@o314800.ingest.sentry.io/5205525',
});

ReactDOM.render(<App />, document.getElementById('root'));
