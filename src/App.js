import React, { Component } from 'react';
import Header from './Header';
import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import injectTapEventPlugin from 'react-tap-event-plugin';


class App extends Component {
  render() {
    /* Needed for onTouchTap
       http://stackoverflow.com/a/34015469/988941
    */
    injectTapEventPlugin();
    return (<div>
              <Header/>
              <div>
                <br/>
                <MessageList/>
                <PostMessageView/>
              </div>
            </div>)
  }
}

export default App;
