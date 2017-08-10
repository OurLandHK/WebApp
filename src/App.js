import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Footer, Row, Col, Button, Container} from 'reactstrap';
import { SocialIcon } from 'react-social-icons';
import Header from './Header';
import MessageList from './MessageList';
import DrawerMenu from './Drawer';
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
