import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import PublicProfile from './PublicProfile';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Main extends Component {
  constructor(props) {
    super(props);
    let params = (new URL(document.location)).searchParams;
    this.eventId = params.get("eventid");
    this.userId = params.get("userid");
    this.eventNumber = params.get("eventnumber");
    if(this.eventNumber == null) {
      this.eventNumber = 20;
    }
  }

  handleClick() {
    this.openDialog();
  };


  render() {

    let pubilcProfileHtml = null;
    let messageHtml = null;
    console.log("Query UserID: " + this.userId + " eventID: " + this.eventId);
    if(this.userId != null) {
      pubilcProfileHtml = <PublicProfile id={this.userId}/>;
    } else {
      messageHtml = <div><MessageList uuid={this.eventId} eventNumber={this.eventNumber}/><PostMessageView/></div>;
    }
    return (
      <div>
        <br/>
          {pubilcProfileHtml}
          {messageHtml}
      </div>
    );
  }

}

export default Main;
