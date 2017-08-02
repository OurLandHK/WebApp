import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Footer, Row, Col, Button, Container} from 'reactstrap';
import { SocialIcon } from 'react-social-icons';
import Header from './Header';
import MessageList from './MessageList';

class App extends Component {
  render() {
    return (<div><Header/><br/><br/><Container><MessageList/></Container></div>)
  }
}

export default App;
