import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import { MuiThemeProvider, createMuiTheme }
  from 'material-ui/styles';

const theme = createMuiTheme({
  typography: {
    "fontFamily": "Comic Sans",
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root'));
