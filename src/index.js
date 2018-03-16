import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { MuiThemeProvider, createMuiTheme }
  from 'material-ui/styles';
import { createStore, applyMiddleware } from 'redux';  
import thunk from 'redux-thunk';  
import { Provider } from 'react-redux';  
import rootReducer from './reducers';
import App from './App';


const theme = createMuiTheme({
  typography: {
    "fontFamily": "Noto Sans CJK TC, Arial",
  }
});


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);  
const store = createStoreWithMiddleware(rootReducer);



ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'));
