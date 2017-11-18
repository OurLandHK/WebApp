import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import React, { Component } from 'react';

class Main extends Component {
  render() {
    return (
      <div>
        <br/>
        <MessageList/>
        <PostMessageView/>
      </div>
    );
  }

}

export default Main;
