import { withStyles } from '@material-ui/core/styles';
import NearbyEventDialog from './NearbyEventDialog';
import RegionEventDialog from './RegionEventDialog';
import MessageDialog from './MessageDialog';
import MessageView from './MessageView';
import {getMessage} from './MessageDB';
import React, { Component } from 'react';
import MessageList from './MessageList';
import config, {constant} from './config/default';
import {
  updateRecentMessage,
  updatePublicProfileDialog,
} from './actions';
import {connect} from 'react-redux';

const styles = () => ({
  container: {
  },

  contentWrapper: {
    marginBottom: '40px'
  }
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
    const {focusMessages} = this.props.ourland;
    const { classes } = this.props;
    let focusMessage = null

    if(queryMessage != null) {
      let message = queryMessage;
      recentMessage = <div className="recent-event-wrapper">
                        <h4>{constant.recentEventLabel}</h4>
                        <MessageView message={message} key={message.key} openDialogDefault={openRecent} />
                      </div>;
    }
    if(focusMessages.length > 0) {
      focusMessage = <div className="focus-message-wrapper">
        <h4>{constant.focusMessagesLabel}</h4>
        <MessageList
          ref={(messageList) => {this.messageList = messageList;}}
          eventNumber={100}
          distance={10}
          messageIds={focusMessages}
          hori={true}
        />
      </div>
    }

    return (
      <div className={classes.container}>
        {recentMessage}
        {focusMessage}
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
      </div>
    );
  }

  render() {
    let messageHtml = this.renderMessageFrontPage();
    const { classes } = this.props;
    return (
      <div className={classes.contentWrapper}>
          {messageHtml}       
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recentMessage : state.recentMessage,
    ourland : state.ourland,
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
