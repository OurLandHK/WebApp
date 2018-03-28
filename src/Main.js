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
    const { updateRecentMessage } = this.props;
    if(geolocation == null) {
      geolocation = constant.invalidLocation;
    }
    if(this.props.eventId != "") {
      updateRecentMessage(this.props.eventId, true);
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
  }
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)
(withStyles(styles)(Main));
