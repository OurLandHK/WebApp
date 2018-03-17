import { withStyles } from 'material-ui/styles';
import NearbyEventDialog from './NearbyEventDialog';
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

  renderMessageFrontPage() {
    const { eventNumber, distance, geolocation, eventId } = this.state;
    let linebreak = <div><br/><br/><br/></div>;
    const { classes } = this.props; 
    // Display recent message
    /*     if(this.state.eventId != null && this.state.eventId != "") {
      getMessage(this.state.eventId).then((message) => {this.queryMessage = message});
    } else {
      this.queryMessage = null;
    }

    if(this.queryMessage != null) {      
      var message = this.queryMessage;
      queryMessage = <MessageView message={message} key={message.key} user={this.state.user} lon={lon} lat={lat} openDialogDefault={true} />;  
    }
    */ 
    return (
      <div className={classes.container}>
        {linebreak}
        <NearbyEventDialog 
                  eventNumber={eventNumber}
                  distance={distance}
                  geolocation={geolocation}/>
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
      messageHtml = this.renderMessageFrontPage();
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
