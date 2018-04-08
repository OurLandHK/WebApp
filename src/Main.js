import { withStyles } from 'material-ui/styles';
import NearbyEventDialog from './NearbyEventDialog';
import RegionEventDialog from './RegionEventDialog';
import PostMessageView from './PostMessageView';
import MessageDialog from './MessageDialog';
import PublicProfile from './PublicProfile';
import MessageView from './MessageView';
import {getMessage} from './MessageDB';
import React, { Component } from 'react';
import config, {constant} from './config/default';
import {
  updateRecentMessage,
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';

const styles = () => ({
  container: {
  },
});

class Main extends Component {
  constructor(props) {
    super(props);
    let geolocation = this.props.geolocation;
    const { updateRecentMessage, updatePublicProfileDialog } = this.props;
    if(geolocation == null) {
      geolocation = constant.invalidLocation;
    }
    if(this.props.userId != "") {
      updatePublicProfileDialog(this.props.userId, "", true);
    }    
    if(this.props.eventId != "") {
      updateRecentMessage(this.props.eventId, true);
    }
    this.state = {
        userId: this.props.userId,
        eventId: this.props.eventId,
        eventNumber: this.props.eventNumber,
        distance: this.props.distance, 
        geolocation: this.props.geolocation
      };
    
  }

  handleClick() {
    this.openDialog();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.recentMessage != prevProps.recentMessage) {
      this.refreshQueryMessage();
    }
  }

  refreshQueryMessage() {
    if(this.props.recentMessage.id != "") {
      console.log("eventID: " + this.props.recentMessage.id);
      getMessage(this.props.recentMessage.id).then((message) => {this.setState({queryMessage: message})});
    } else {
      this.queryMessage = null;
    }
  }

  renderMessageFrontPage() {
    let recentMessage = null;
    const { eventNumber, distance, geolocation, eventId, queryMessage} = this.state;
    const {open: openRecent} = this.props.recentMessage;
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
    let messageHtml = this.renderMessageFrontPage();
    return (
      <div>
        <br/>
          {messageHtml}
          <PublicProfile />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recentMessage : state.recentMessage,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRecentMessage:
      (recentMessageID, open) =>
        dispatch(updateRecentMessage(recentMessageID, open)),
    updatePublicProfileDialog:
      (userId, fbuid, open) =>
        dispatch(updatePublicProfileDialog(userId, fbuid, open)),
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)(Main));
