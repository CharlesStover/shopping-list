import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');

if (root) {
  ReactDOM.render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>,
    root
  );
  registerServiceWorker();
}
