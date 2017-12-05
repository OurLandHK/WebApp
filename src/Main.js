import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import React, { Component } from 'react';

class Main extends Component {
  constructor(props) {
    super(props);
    if(this.props.match.params.id != undefined)
    {
      console.log("para: " + this.props.match.params.id);
      this.uuid = this.props.match.params.id;
    } else {
      console.log("no para: " + this.props.match.params.id);
      this.uuid = null;
    }
  }

  handleClick() {
    this.openDialog();
  };

  render() {
    return (
      <div>
        <br/>
        <MessageList uuid={this.uuid}/>
        <PostMessageView/>
      </div>
    );
  }

}

export default Main;
