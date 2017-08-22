import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Container} from 'reactstrap';
import Header from './Header';
import MessageList from './MessageList';
import injectTapEventPlugin from 'react-tap-event-plugin';


class App extends Component {
  render() {
    // Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();
    return (<div><Header/><Container><MessageList/></Container></div>)
  }
}

export default App;
