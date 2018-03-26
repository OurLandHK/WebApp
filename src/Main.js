import { withStyles } from 'material-ui/styles';
import NearbyEventDialog from './NearbyEventDialog';
import RegionEventDialog from './RegionEventDialog';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import PublicProfile from './PublicProfile';
import MessageView from './MessageView';
import {getMessage, fetchMessagesBaseOnGeo} from './MessageDB';
import React, { Component } from 'react';
import config, {constant} from './config/default';

const styles = () => ({
  container: {
  },
});

class Main extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    if(geolocation == null) {
      geolocation = constant.invalidLocation;
    }
    var openRecent = false;
    if(this.props.eventId != "") {
      openRecent = true;
    }
    this.state = {
        eventId: this.props.eventId,
        eventNumber: this.props.eventNumber,
        distance: this.props.distance, 
        openRecent: openRecent,
        geolocation: this.props.geolocation
      };
    
  }

  handleClick() {
    this.openDialog();
  };

  componentDidMount() {
    if(this.state.eventId != "") {
      console.log("eventID: " + this.state.eventId);
      getMessage(this.state.eventId).then((message) => {this.setState({queryMessage: message})});
    } else {
      this.queryMessage = null;
    }
  }

  renderMessageFrontPage() {
    let recentMessage = null;
    const { eventNumber, distance, geolocation, eventId, queryMessage, openRecent} = this.state;
    let linebreak = <div><br/><br/></div>;
    const { classes } = this.props; 

    if(queryMessage != null) {      
      var message = queryMessage;
      recentMessage = <div>
                        {constant.recentEventLabel}
                        <MessageView message={message} key={message.key} openDialogDefault={openRecent} />
                        <br/>
                      </div>;
    }    

    return (
      <div className={classes.container}>
        {linebreak}
        {recentMessage}
        <NearbyEventDialog 
          eventNumber={eventNumber}
          distance={distance}
          geolocation={geolocation}
        />
        <RegionEventDialog 
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
