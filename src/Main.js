import { withStyles } from 'material-ui/styles';
import MessageList from './MessageList';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import PublicProfile from './PublicProfile';
import React, { Component } from 'react';
import config, {constant} from './config/default';

const styles = () => ({
  container: {
    marginTop: '0.5rem',
  },
});

class Main extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    if(geolocation == null) {
      geolocation = constant.invalidLocation;
    }
    this.state = {
        eventId: this.props.eventId,
        eventNumber: this.props.eventNumber,
        distance: this.props.distance, 
        geolocation: this.props.geolocation
      };
  }

  handleClick() {
    this.openDialog();
  };

  renderMessages() {
    const { eventNumber, distance, geolocation, eventId } = this.state;
    const { classes } = this.props; 
    return (
      <div className={classes.container}>
        <MessageList
          ref={(messageList) => {this.messageList = messageList;}}
          uuid={eventId}
          eventNumber={eventNumber}
          distance={distance}
          geolocation={geolocation}
        />
        <PostMessageView />
      </div>
    );
  }

  render() {
    let pubilcProfileHtml = null;
    let messageHtml = null;
    console.log("Query UserID: " + this.state.userId + " eventID: " + this.state.eventId);
    if(this.state.userId != null && this.state.userId != "") {
      pubilcProfileHtml = <PublicProfile id={this.state.userId}/>;
    } else {
      messageHtml = this.renderMessages();
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

export default withStyles(styles)(Main);
