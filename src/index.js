import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import { MuiThemeProvider, createMuiTheme }
  from 'material-ui/styles';

const theme = createMuiTheme({
  typography: {
    "fontFamily": "Noto Sans CJK TC, Arial",
  }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root'));
