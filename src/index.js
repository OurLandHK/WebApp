import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme }
  from '@material-ui/core/styles';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import App from './App';
import MessageDialogSSR from './MessageDialogSSR';
import PublicProfileSSR from './PublicProfileSSR';
import BookmarkViewSSR from './BookmarkViewSSR';
import { init3rdPartyLibraries } from './actions';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer);
const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

init3rdPartyLibraries();

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>,
    root);
}

const detailRoot = document.getElementById('detailRoot');
if (detailRoot) {
  const segments = document.URL.split('/');
  let path = segments[segments.length - 1];
  path.split('?');  
  const uuid = path[0];
  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <MessageDialogSSR uuid={uuid} />
      </Provider>
    </MuiThemeProvider>,
    detailRoot);
}

const userRoot = document.getElementById('userRoot');
if (userRoot) {
  const parts = document.URL.split('/');
  let userIndex = parts.length - 1;
  while(userIndex > 0) {
    //console.log(req.url + "  " + parts[userIndex] + " " + userIndex)
    if(parts[userIndex] === 'user') {
          userIndex++;
          break;
    }
    userIndex--;
  }
  let userid = parts[userIndex];
  let bookmarkid = null;
  if(userIndex < parts.length - 1) {
    let path = parts[userIndex+1];
    path.split('?');  
    bookmarkid = path[0];
  } else {
    let path = userid;
    path.split('?');  
    userid = path[0];
  }
  console.log(`userID ${userid} bookmarkID ${bookmarkid}`);
  let userHtml = <PublicProfileSSR userid={userid} />;
  if(bookmarkid  != null ) {
    userHtml = <BookmarkViewSSR userid={userid} bookmarkid={bookmarkid} />
  }
  ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        {userHtml}
      </Provider>
    </MuiThemeProvider>,
    userRoot);
}
